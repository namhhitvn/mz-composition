import { TodoModel } from '../../../shared/models/todo.model';
import { CreateTodoRestRequestBody } from '../../../shared/rest/todo';
import { throwOnMongoBuilderQueryResultError } from '../../../../../lib/node';

export class CreateTodoService {
  public async handle(body: CreateTodoRestRequestBody) {
    const res = await TodoModel().createQueryBuilder().values(body).insert();
    throwOnMongoBuilderQueryResultError(res);
    return res.data;
  }
}
