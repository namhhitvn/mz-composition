import {
  ListTodoRestRequest,
  ListTodoRestRequestResponse,
} from '../../../shared/rest/todo/list-todo';
import { RestController } from '../../../../../lib/node';
import { ListTodoService } from '../service/list-todo.service';

export class ListTodoController extends RestController<
  typeof ListTodoRestRequest
> {
  public async handle(): Promise<void> {
    const res = await new ListTodoService().handle(this.req.query);
    this.response(new ListTodoRestRequestResponse(res));
  }
}
