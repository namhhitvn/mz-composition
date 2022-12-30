import { BaseRestController } from '../../../../../lib/node';
import {
  ListTodoRestRequest,
  ListTodoRestRequestResponse
} from '../../../shared';
import { ListTodoService } from '../service/list-todo.service';

export class ListTodoController extends BaseRestController<
  typeof ListTodoRestRequest
> {
  public async handle(): Promise<void> {
    const res = await new ListTodoService(this.req).exec();
    this.response(new ListTodoRestRequestResponse(res));
  }
}
