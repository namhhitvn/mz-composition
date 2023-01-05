import {
  BaseRestController,
  RestRequestResponseOK,
} from '../../../../../lib/node';
import { DeleteTodoRestRequest } from '../../../shared/rest/todo';
import { DeleteTodoService } from '../service/delete-todo.service';

export class DeleteTodoController extends BaseRestController<
  typeof DeleteTodoRestRequest
> {
  public async handle(): Promise<void> {
    await new DeleteTodoService(this.req).exec();
    this.response(new RestRequestResponseOK());
  }
}
