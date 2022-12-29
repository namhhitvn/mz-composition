import {
  GetByIdRestRequestParams,
  HttpRestRequest,
  HttpRestRequestRepository,
  HttpRestResponse,
} from '../../../../../lib/core';
import { Todo } from '../../interfaces';

export class GetTodoRestRequestResponse extends HttpRestResponse<Todo> {}

@HttpRestRequestRepository({
  path: '/api/v1/todos/:id',
  Response: GetTodoRestRequestResponse,
  Params: GetByIdRestRequestParams,
})
export class GetTodoRestRequest extends HttpRestRequest<
  typeof GetTodoRestRequestResponse,
  typeof GetByIdRestRequestParams
> {}
