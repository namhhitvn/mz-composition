import {
  BaseRestControllerService,
  throwOnMongoBuilderQueryResultError,
} from '../../../../../lib/node';
import { TodoModel } from '../../../shared';
import { CreateTodoRestRequest } from '../../../shared/rest/todo/create-todo';

export class CreateTodoService extends BaseRestControllerService<
  typeof CreateTodoRestRequest
> {
  public async exec() {
    const res = await TodoModel()
      .createQueryBuilder()
      .values(this.req.body)
      .insert();
    throwOnMongoBuilderQueryResultError(res);
    return res.data;
  }
}
