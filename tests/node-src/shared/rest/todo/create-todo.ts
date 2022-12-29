import {
  HttpRequestMethod,
  HttpRestRequest,
  HttpRestRequestRepository,
  HttpRestResponse,
} from '../../../../../lib/core';
import { WithRequired } from '../../../../../lib/interfaces';
import { Todo } from '../../interfaces';

export class CreateTodoRestRequestResponse extends HttpRestResponse<Todo> {}

export class CreateTodoRestRequestBody
  implements WithRequired<Todo, 'title' | 'active'>
{
  public title!: string;
  public active!: boolean;
}

@HttpRestRequestRepository({
  path: '/api/v1/todos',
  method: HttpRequestMethod.POST,
  Response: CreateTodoRestRequestResponse,
  Body: CreateTodoRestRequestBody,
})
export class CreateTodoRestRequest extends HttpRestRequest<
  typeof CreateTodoRestRequestResponse,
  undefined,
  typeof CreateTodoRestRequestBody
> {}
