import { RestRequestResponseOK } from '../../../../../lib/core';
import { RestoreTodoRestRequest } from '../../../shared/rest/todo';
import { RestController } from '../../../../../lib/node';
import { RestoreTodoService } from '../service/restore-todo.service';

export class RestoreTodoController extends RestController<
  typeof RestoreTodoRestRequest
> {
  public async handle(): Promise<void> {
    await new RestoreTodoService().handle(this.req.params);
    this.response(new RestRequestResponseOK());
  }
}
