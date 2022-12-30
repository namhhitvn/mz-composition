import { BaseRestController } from '../../../../../lib/node';
import {
  GetTodoRestRequest,
  GetTodoRestRequestResponse
} from '../../../shared';
import { GetTodoService } from '../service/get-todo.service';

export class GetTodoController extends BaseRestController<
  typeof GetTodoRestRequest
> {
  public async handle(): Promise<void> {
    const res = await new GetTodoService(this.req).exec();
    this.response(new GetTodoRestRequestResponse(res));
  }
}
