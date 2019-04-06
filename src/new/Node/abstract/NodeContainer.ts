import { Node, NodeDataType } from './Node'

export type NullableKeys<T> = ({
  [P in keyof T]: T[P] extends NodeContainer<any, true> ? P : never
})[keyof T]

export type NonNullableKeys<T> = ({
  [P in keyof T]: T[P] extends NodeContainer<any, false> ? P : never
})[keyof T]

export type InnerNode<T extends Node<any>> = T extends NodeContainer<
  infer U,
  any
>
  ? NodeDataType<U> extends NodeDataType<T>
    ? U extends NodeContainer<infer T, any>
      ? NodeDataType<U> extends NodeDataType<T>
        ? T extends NodeContainer<infer U, any>
          ? NodeDataType<U> extends NodeDataType<T>
            ? U extends NodeContainer<infer T, any>
              ? NodeDataType<U> extends NodeDataType<T>
                ? T extends NodeContainer<infer U, any>
                  ? NodeDataType<U> extends NodeDataType<T>
                    ? U
                    : never
                  : T
                : never
              : U
            : never
          : T
        : never
      : U
    : never
  : T

export abstract class NodeContainer<
  TNode extends Node<any>,
  TNullable extends boolean = false,
  DataType = NodeDataType<TNode>
> extends Node<DataType> {
  constructor(public ofNode: TNode, public nullable = false as TNullable) {
    super()
  }
}