import {
  UpdateTodoRestRequest,
  UpdateTodoRestRequestResponse,
} from '../../../shared/rest/todo';
import { RestController } from '../../../../../lib/node';
import { UpdateTodoService } from '../service/update-todo.service';

export class UpdateTodoController extends RestController<
  typeof UpdateTodoRestRequest
> {
  public async handle(): Promise<void> {
    const res = await new UpdateTodoService().handle(
      this.req.params,
      this.req.body,
    );
    this.response(new UpdateTodoRestRequestResponse(res));
  }
}
