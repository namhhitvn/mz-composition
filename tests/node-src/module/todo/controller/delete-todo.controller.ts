import { RestRequestResponseOK } from '../../../../../lib/core';
import { DeleteTodoRestRequest } from '../../../shared/rest/todo';
import { RestController } from '../../../../../lib/node';
import { DeleteTodoService } from '../service/delete-todo.service';

export class DeleteTodoController extends RestController<
  typeof DeleteTodoRestRequest
> {
  public async handle(): Promise<void> {
    await new DeleteTodoService().handle(this.req.params);
    this.response(new RestRequestResponseOK());
  }
}
