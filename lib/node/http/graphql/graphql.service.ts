import { BaseContext } from '@apollo/server';
import { ObjectLiteral, PromiseAble } from '../../../interfaces';
import { BaseGraphqlController } from './graphql.controller';
import { Resolver, ResolverFn } from './interface';

export abstract class BaseGraphqlControllerService<
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

  constructor(protected controller: BaseGraphqlController<T>) {
    this.parent = controller['parent'] as ResolverParent;
    this.args = controller['args'] as ResolverArgs;
    this.context = controller['context'] as ResolverContext;
    this.info = controller['info'] as unknown as ResolverInfo;
  }

  protected abstract exec(): ResolverReturnType;
}
