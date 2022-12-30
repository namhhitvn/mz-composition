import { BaseRestController, RestRequestResponseOK } from '../../../../../lib/node';
import { RestoreTodoRestRequest } from '../../../shared';
import { RestoreTodoService } from '../service/restore-todo.service';

export class RestoreTodoController extends BaseRestController<
  typeof RestoreTodoRestRequest
> {
  public async handle(): Promise<void> {
    await new RestoreTodoService(this.req).exec();
    this.response(new RestRequestResponseOK());
  }
}
