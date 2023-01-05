import {
  BaseGraphqlController,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { GraphqlResolver } from '../../../interfaces';
import { TodoModel } from '../../../shared';

export class TodoDetailController extends BaseGraphqlController<
  GraphqlResolver.QueryResolvers['todoDetail']
> {
  async exec() {
    if (!this.args.id) {
      return null;
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(this.args.id)
      .findOne();
    throwOnMongoBuilderQueryResultError(res);

    if (!res.data._id) {
      return null;
    }

    return res.data;
  }
}
