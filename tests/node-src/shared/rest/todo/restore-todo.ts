import {
  GetByIdRestRequestParams,
  HttpRequestMethod,
  HttpRestRequest,
  HttpRestRequestRepository,
  RestRequestResponseOK,
} from '../../../../../lib/core';

@HttpRestRequestRepository({
  path: '/api/v1/todos/:id/restore',
  method: HttpRequestMethod.PUT,
  Response: RestRequestResponseOK,
  Params: GetByIdRestRequestParams,
})
export class RestoreTodoRestRequest extends HttpRestRequest<
  typeof RestRequestResponseOK,
  typeof GetByIdRestRequestParams
> {}
