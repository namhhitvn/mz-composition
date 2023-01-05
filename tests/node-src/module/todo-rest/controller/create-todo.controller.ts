import { BaseRestController, HttpStatusCode } from '../../../../../lib/node';
import {
  CreateTodoRestRequest,
  CreateTodoRestRequestResponse,
} from '../../../shared';
import { CreateTodoService } from '../service/create-todo.service';

export class CreateTodoController extends BaseRestController<
  typeof CreateTodoRestRequest
> {
  public async handle(): Promise<void> {
    const res = await new CreateTodoService(this.req).exec();
    this.setStatus(HttpStatusCode.CREATED).response(
      new CreateTodoRestRequestResponse(res),
    );
  }
}
