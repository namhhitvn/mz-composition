import { ListTodoRestRequestQuery } from '../../../shared/rest/todo/list-todo';
import { TodoModel } from '../../../shared/models/todo.model';
import { throwOnMongoBuilderQueryResultError } from '../../../../../lib/node';

export class ListTodoService {
  public async handle(query: ListTodoRestRequestQuery) {
    const qb = TodoModel().createQueryBuilder();

    if (query.keyword) {
      qb.filterTitle(new RegExp(query.keyword, 'gi'));
    }

    const res = await qb.find();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
