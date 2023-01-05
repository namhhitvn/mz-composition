import {
  BaseGraphqlController,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { GraphqlResolver } from '../../../interfaces';
import { TodoModel } from '../../../shared';

export class TodoCreateController extends BaseGraphqlController<
  GraphqlResolver.MutationResolvers['todoCreate']
> {
  async exec() {
    const { title, active } = this.args.body;
    const res = await TodoModel()
      .createQueryBuilder()
      .values({ title, active: active || false })
      .insert();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
