import {
  BaseGraphqlController,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { GraphqlResolver } from '../../../interfaces';
import { TodoModel } from '../../../shared';

export class TodoDeleteController extends BaseGraphqlController<
  GraphqlResolver.MutationResolvers['todoDelete']
> {
  async exec() {
    if (!this.args.id) {
      return false;
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(this.args.id)
      .softDelete();
    throwOnMongoBuilderQueryResultError(res);

    return true;
  }
}
