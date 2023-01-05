import { pick } from 'lodash';
import {
  BaseGraphqlController,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { GraphqlResolver } from '../../../interfaces';
import { TodoModel } from '../../../shared';

export class TodoUpdateController extends BaseGraphqlController<
  GraphqlResolver.MutationResolvers['todoUpdate']
> {
  async exec() {
    if (!this.args.id) {
      return null;
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(this.args.id)
      .values(pick(this.args.body, ['title', 'active']) as any)
      .update();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
