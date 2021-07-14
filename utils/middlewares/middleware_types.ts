import { IRequestMiddleware } from "@pagopa/ts-commons/lib/request_middleware";

export type IRequestMiddlewares<K, R, T> = {
  readonly [key in keyof K]: IRequestMiddleware<R, T>;
};
export type MiddlewareResult<T> = T extends IRequestMiddleware<unknown, infer R>
  ? R
  : never;
export type MiddlewareFailure<T> = T extends IRequestMiddleware<
  infer R,
  unknown
>
  ? R
  : never;

export type MiddlewaresFailureResults<T> = {
  readonly [k in keyof T]: MiddlewareFailure<T[k]>;
};

export type MiddlewaresResults<T> = {
  readonly [k in keyof T]: MiddlewareResult<T[k]>;
};

export type AllMiddlewaresFailureResults<M> = ParamsUnion<
  MiddlewaresFailureResults<M>
>;
export type AllMiddlewaresResults<M> = ParamsUnion<MiddlewaresResults<M>>;

type ParamsUnion<OBJ> = OBJ[keyof OBJ];
