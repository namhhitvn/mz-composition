import {
  GetTodoRestRequest,
  GetTodoRestRequestResponse,
} from '../../../shared/rest/todo';
import { RestController } from '../../../../../lib/node';
import { GetTodoService } from '../service/get-todo.service';

export class GetTodoController extends RestController<
  typeof GetTodoRestRequest
> {
  public async handle(): Promise<void> {
    const res = await new GetTodoService().handle(this.req.params);
    this.response(new GetTodoRestRequestResponse(res));
  }
}
