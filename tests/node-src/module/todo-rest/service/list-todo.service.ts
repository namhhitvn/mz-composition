import {
  BaseRestControllerService,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { ListTodoRestRequest, TodoModel } from '../../../shared';

export class ListTodoService extends BaseRestControllerService<
  typeof ListTodoRestRequest
> {
  public async exec() {
    const qb = TodoModel().createQueryBuilder();

    if (this.req.query.keyword) {
      qb.filterTitle(new RegExp(this.req.query.keyword, 'gi'));
    }

    const res = await qb.find();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
