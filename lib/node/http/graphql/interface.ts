import { BaseContext } from '@apollo/server';
import { GraphQLResolveInfo } from 'graphql';
import { ObjectLiteral } from '../../../interfaces';

export type ResolverWithResolve<TResult, TParent, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TArgs>;
};
export type Resolver<
  TResult,
  TParent extends ObjectLiteral,
  TArgs extends ObjectLiteral,
> =
  | ResolverFn<TResult, TParent, TArgs>
  | ResolverWithResolve<TResult, TParent, TArgs>;

export type ResolverFn<TResult, TParent, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: BaseContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;
