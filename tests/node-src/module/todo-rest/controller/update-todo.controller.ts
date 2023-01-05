import { BaseRestController } from '../../../../../lib/node';
import {
  UpdateTodoRestRequest,
  UpdateTodoRestRequestResponse,
} from '../../../shared';
import { UpdateTodoService } from '../service/update-todo.service';

export class UpdateTodoController extends BaseRestController<
  typeof UpdateTodoRestRequest
> {
  public async handle(): Promise<void> {
    const res = await new UpdateTodoService(this.req).exec();
    this.response(new UpdateTodoRestRequestResponse(res));
  }
}
