import {
  BaseGraphqlController,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { GraphqlResolver } from '../../../interfaces';
import { TodoModel } from '../../../shared';

export class TodoRestoreController extends BaseGraphqlController<
  GraphqlResolver.MutationResolvers['todoRestore']
> {
  async exec() {
    if (!this.args.id) {
      return false;
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(this.args.id)
      .restore();
    throwOnMongoBuilderQueryResultError(res);

    return true;
  }
}
