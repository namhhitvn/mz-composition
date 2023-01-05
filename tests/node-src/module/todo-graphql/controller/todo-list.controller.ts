import {
  BaseGraphqlController,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { GraphqlResolver } from '../../../interfaces';
import { TodoModel } from '../../../shared';

export class TodoListController extends BaseGraphqlController<
  GraphqlResolver.QueryResolvers['todoList']
> {
  async exec() {
    const qb = TodoModel().createQueryBuilder();

    if (this.args.query?.keyword) {
      qb.filterTitle(new RegExp(this.args.query?.keyword, 'gi'));
    }

    const res = await qb.find();
    throwOnMongoBuilderQueryResultError(res);

    return res;
  }
}
