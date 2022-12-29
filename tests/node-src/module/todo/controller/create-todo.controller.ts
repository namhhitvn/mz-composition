import {
  CreateTodoRestRequest,
  CreateTodoRestRequestResponse,
} from '../../../shared/rest/todo';
import { HttpStatusCode, RestController } from '../../../../../lib/node';
import { CreateTodoService } from '../service/create-todo.service';

export class CreateTodoController extends RestController<
  typeof CreateTodoRestRequest
> {
  public async handle(): Promise<void> {
    const res = await new CreateTodoService().handle(this.req.body);
    this.setStatus(HttpStatusCode.CREATED).response(
      new CreateTodoRestRequestResponse(res),
    );
  }
}
