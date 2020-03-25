import { Query } from 'gqless'
import * as React from 'react'

import { useComponentContext } from '../hooks/useComponentContext'
import { StackContext } from '../Query'
import { useAccessors } from './useAccessors'
import { useFragments, VariantContext } from './useFragments'

/**
 * Options of the gqless graphql HOC
 *
 * @export
 * @interface IGraphQLOptions
 */
export interface IGraphQLOptions {
  name?: string
  separateRequest?: boolean
  /**
   * Whether or not child components can use their own queries.
   *
   * true  | child components can use their own queries
   * false | all queries will be merged into this components query
   * null  | (default) inherited with React context
   */
  allowInheritance?: boolean | null
  /**
   * Whether to add or not suspense support
   *
   * true  | (default) add React Suspense
   * false | disable React Suspense support
   *
   * @type {boolean}
   * @memberof IGraphQLOptions
   */
  suspense?: boolean
}

const isClientSide = typeof window !== 'undefined'

type IComponent<T> = {
  (props: T): any
  getInitialProps?: (ctx: any) => Record<any, any> | Promise<Record<any, any>>
  displayName?: string
}

export const graphql = <Props extends any>(
  component: IComponent<Props>,
  {
    name = component?.displayName,
    allowInheritance = null,
    separateRequest = false,
    suspense = true,
  }: IGraphQLOptions = {}
) => {
  const query = new Query(name, false)
  const state: any[] = []

  const GraphQLComponent = (props: Props) => {
    const parentVariant = React.useContext(VariantContext)
    const parentStack = React.useContext(StackContext)

    const stack = React.useMemo((): StackContext => {
      if (!parentStack.inheritance) return parentStack

      return {
        ...parentStack,
        inheritance:
          allowInheritance === null
            ? parentStack.inheritance
            : allowInheritance,
        frames: separateRequest ? [query] : [...parentStack.frames, query],
      }
    }, [separateRequest || parentStack])

    useComponentContext.value = {
      variantFragments: undefined!,
      lastStateIndex: -1,
      state,
      stack,
      accessors: undefined!,
      query,
      schedulers: undefined!,
    }

    const {
      accessors,
      schedulers,
      startIntercepting,
      stopIntercepting,
      updateAccessors,
    } = useAccessors(stack)
    Object.assign(useComponentContext.value, { accessors, schedulers })

    const {
      variantFragments,
      startResolving,
      stopResolving,
      getRenderVariants,
    } = useFragments()
    Object.assign(useComponentContext.value, { variantFragments })

    try {
      startResolving()
      startIntercepting()

      var returnValue = component(props)
    } catch (e) {
      throw e
    } finally {
      useComponentContext.value = undefined
      stopIntercepting()
      stopResolving()
    }

    // If we've recorded Abstract accessors in the
    // variantFragments, then create an array
    // containing all variants of the resolved types
    //
    // then return a new component for each variant,
    // which will convert accessors into fragmentaccessors
    // at render.
    if (variantFragments.size) {
      const renderVariants = getRenderVariants()

      if (renderVariants.length)
        return renderVariants.map((variant, i) => (
          <VariantContext.Provider
            key={i}
            value={[...parentVariant, ...variant]}
          >
            <GraphQLComponent {...props} />
          </VariantContext.Provider>
        ))
    }

    returnValue = (
      <StackContext.Provider value={stack}>{returnValue}</StackContext.Provider>
    )

    const promise = updateAccessors()

    // React suspense support
    if (isClientSide && suspense && promise) {
      let resolved = false
      promise.then(() => (resolved = true))

      // We can't directly throw the promise, otherwise
      // child components (with data requirements) won't
      // render - meaning multiple requests
      //
      // To prevent this we instead return a Fragment,
      // which contains a component that throws the Promise.
      const Suspend = () => {
        // This is necessary to prevent an infinite loop
        if (resolved) return null

        throw promise
      }

      return (
        <>
          {returnValue}
          <Suspend />
        </>
      )
    }

    return returnValue
  }

  GraphQLComponent.displayName = name
  GraphQLComponent.query = query

  GraphQLComponent.getInitialProps = async (ctx: { AppTree: React.FC }) => {
    let initialProps: Record<any, any>

    if (typeof component.getInitialProps === 'function') {
      initialProps = await component.getInitialProps(ctx)
    } else {
      initialProps = {}
    }

    if (!isClientSide && ctx?.AppTree) {
      React.createElement(ctx.AppTree, initialProps)
    }

    // This gqlQueryName is needed to prevent a Next.js
    // warning due to this function possibly returning an empty object

    return { gqlessQueryName: query.toString(), ...initialProps }
  }

  return GraphQLComponent
}
