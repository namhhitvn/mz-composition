import { BaseContext } from '@apollo/server';
import { ObjectLiteral, PromiseAble } from '../../../interfaces';
import { Resolver, ResolverFn } from './interface';

export abstract class BaseGraphqlController<
  T extends Resolver<any, any, any> | undefined,
  GraphqlResolver extends ResolverFn<any, any, any> = Extract<
    T,
    ResolverFn<any, any, any>
  >,
  ResolverReturnType extends PromiseAble<any> = ReturnType<GraphqlResolver>,
  ResolverParent extends ObjectLiteral = Parameters<GraphqlResolver>[0],
  ResolverArgs extends ObjectLiteral = Parameters<GraphqlResolver>[1],
  ResolverContext extends BaseContext = BaseContext,
  ResolverInfo extends ObjectLiteral = Parameters<GraphqlResolver>[3],
> {
  protected parent!: ResolverParent;
  protected args!: ResolverArgs;
  protected context!: ResolverContext;
  protected info!: ResolverInfo;

  protected abstract exec(): ResolverReturnType;

  public handle = (
    parent: ResolverParent,
    args: ResolverArgs,
    context: ResolverContext,
    info: ResolverInfo,
  ): ResolverReturnType => {
    this.parent = parent;
    this.args = args;
    this.context = context;
    this.info = info;

    return this.exec() as ResolverReturnType;
  }
}
