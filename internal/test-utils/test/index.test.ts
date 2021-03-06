import fs from 'fs';
import { resolve } from 'path';

import { assertIsDefined, createTestApp, gql, waitForExpect } from '../src';

const { readFile } = fs.promises;

test('create test app with codegen', async () => {
  const codegenPath = resolve('./test/_generated.ts');
  const { client, isReady } = createTestApp(
    {
      schema: `
      type Query {
        hello: String!
      }
      `,
      resolvers: {
        Query: {
          hello(_root) {
            return 'hello world';
          },
        },
      },
    },
    {
      codegenPath,
    }
  );

  await isReady;

  expect(
    await readFile(codegenPath, {
      encoding: 'utf-8',
    })
  ).toMatchInlineSnapshot(`
    "import type { GraphQLResolveInfo } from 'graphql';
    import type { MercuriusContext } from 'mercurius';
    export type Maybe<T> = T | null;
    export type Exact<T extends { [key: string]: unknown }> = {
      [K in keyof T]: T[K];
    };
    export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
      { [SubKey in K]?: Maybe<T[SubKey]> };
    export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
      { [SubKey in K]: Maybe<T[SubKey]> };
    export type ResolverFn<TResult, TParent, TContext, TArgs> = (
      parent: TParent,
      args: TArgs,
      context: TContext,
      info: GraphQLResolveInfo
    ) =>
      | Promise<import('mercurius-codegen').DeepPartial<TResult>>
      | import('mercurius-codegen').DeepPartial<TResult>;
    /** All built-in and custom scalars, mapped to their actual values */
    export type Scalars = {
      ID: string;
      String: string;
      Boolean: boolean;
      Int: number;
      Float: number;
      _FieldSet: any;
    };

    export type Query = {
      __typename?: 'Query';
      hello: Scalars['String'];
    };

    export type ResolverTypeWrapper<T> = Promise<T> | T;

    export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
      fragment: string;
      resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
    };

    export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
      selectionSet: string;
      resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
    };
    export type StitchingResolver<TResult, TParent, TContext, TArgs> =
      | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
      | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
    export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
      | ResolverFn<TResult, TParent, TContext, TArgs>
      | StitchingResolver<TResult, TParent, TContext, TArgs>;

    export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
      parent: TParent,
      args: TArgs,
      context: TContext,
      info: GraphQLResolveInfo
    ) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

    export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
      parent: TParent,
      args: TArgs,
      context: TContext,
      info: GraphQLResolveInfo
    ) => TResult | Promise<TResult>;

    export interface SubscriptionSubscriberObject<
      TResult,
      TKey extends string,
      TParent,
      TContext,
      TArgs
    > {
      subscribe: SubscriptionSubscribeFn<
        { [key in TKey]: TResult },
        TParent,
        TContext,
        TArgs
      >;
      resolve?: SubscriptionResolveFn<
        TResult,
        { [key in TKey]: TResult },
        TContext,
        TArgs
      >;
    }

    export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
      subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
      resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
    }

    export type SubscriptionObject<
      TResult,
      TKey extends string,
      TParent,
      TContext,
      TArgs
    > =
      | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
      | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

    export type SubscriptionResolver<
      TResult,
      TKey extends string,
      TParent = {},
      TContext = {},
      TArgs = {}
    > =
      | ((
          ...args: any[]
        ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
      | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

    export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
      parent: TParent,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

    export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
      obj: T,
      context: TContext,
      info: GraphQLResolveInfo
    ) => boolean | Promise<boolean>;

    export type NextResolverFn<T> = () => Promise<T>;

    export type DirectiveResolverFn<
      TResult = {},
      TParent = {},
      TContext = {},
      TArgs = {}
    > = (
      next: NextResolverFn<TResult>,
      parent: TParent,
      args: TArgs,
      context: TContext,
      info: GraphQLResolveInfo
    ) => TResult | Promise<TResult>;

    /** Mapping between all available schema types and the resolvers types */
    export type ResolversTypes = {
      Query: ResolverTypeWrapper<{}>;
      String: ResolverTypeWrapper<Scalars['String']>;
      Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
    };

    /** Mapping between all available schema types and the resolvers parents */
    export type ResolversParentTypes = {
      Query: {};
      String: Scalars['String'];
      Boolean: Scalars['Boolean'];
    };

    export type QueryResolvers<
      ContextType = MercuriusContext,
      ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
    > = {
      hello?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    };

    export type Resolvers<ContextType = MercuriusContext> = {
      Query?: QueryResolvers<ContextType>;
    };

    /**
     * @deprecated
     * Use \\"Resolvers\\" root object instead. If you wish to get \\"IResolvers\\", add \\"typesPrefix: I\\" to your config.
     */
    export type IResolvers<ContextType = MercuriusContext> = Resolvers<ContextType>;

    export interface Loaders {}

    declare module 'mercurius' {
      interface IResolvers
        extends Resolvers<import('mercurius').MercuriusContext> {}
      interface MercuriusLoaders extends Loaders {}
    }
    "
  `);

  await client
    .query(
      `
    query {
      hello
    }
    `
    )
    .then((response) => {
      expect(response).toEqual({
        data: {
          hello: 'hello world',
        },
      });
    });
});

test('create test app without codegen', async () => {
  const { client, isReady } = createTestApp({
    schema: `
      type Query {
        hello: String!
      }
      `,
    resolvers: {
      Query: {
        hello(_root) {
          return 'hello world';
        },
      },
    },
  });

  await isReady;

  await client
    .query(
      `
    query {
      hello
    }
    `
    )
    .then((response) => {
      expect(response).toEqual({
        data: {
          hello: 'hello world',
        },
      });
    });
});

test('assertIsDefined', () => {
  let a: undefined | number = 1 as undefined | number;

  //@ts-expect-error
  expect(a.toFixed(1)).toBe('1.0');

  assertIsDefined(a);

  expect(a.toFixed(1)).toBe('1.0');

  let b: undefined | number = undefined as undefined | number;

  expect(() => {
    assertIsDefined(b, 'expected error');
  }).toThrowError('expected error');

  let c: undefined | number = undefined as undefined | number;

  expect(() => {
    assertIsDefined(c);
  }).toThrowError('value is nullable');
});

test('waitForExpect', () => {
  let a: number | undefined;

  setTimeout(() => {
    a = 1;
  }, 200);
  waitForExpect(() => {
    expect(a).toBe(1);
  });
});

test('gql', () => {
  const doc = gql`
    query {
      hello
    }
  `;

  expect(doc).toBe(`
    query {
      hello
    }
  `);

  const doc2 = gql`
    query {
      hello${'world'}
    }
  `;

  expect(doc2).toBe(`
    query {
      helloworld
    }
  `);
});
