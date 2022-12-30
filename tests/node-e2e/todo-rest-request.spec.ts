import {
  GetByIdRestRequestParams,
  HttpRequestMethod,
  HttpRestRequestRepository,
  RestRequestResponseOK,
} from '../../lib/core';
import {
  CreateTodoRestRequest,
  CreateTodoRestRequestBody,
  CreateTodoRestRequestResponse,
  DeleteTodoRestRequest,
  GetTodoRestRequest,
  GetTodoRestRequestResponse,
  ListTodoRestRequest,
  ListTodoRestRequestResponse,
  ListTodoRestRequestQuery,
  RestoreTodoRestRequest,
  UpdateTodoRestRequest,
  UpdateTodoRestRequestResponse,
  UpdateTodoRestRequestBody,
} from '../node-src/shared';

describe('Test todo rest request', function () {
  // Tests for CreateTodoRestRequest
  test('Validation metadata of class CreateTodoRestRequest', async () => {
    const metadata = HttpRestRequestRepository.get(CreateTodoRestRequest)!;
    expect(metadata.path).toEqual('/api/v1/todos');
    expect(metadata.method).toEqual(HttpRequestMethod.POST);
    expect(metadata.Response).toEqual(CreateTodoRestRequestResponse);
    expect(metadata.Params).toEqual(undefined);
    expect(metadata.Query).toEqual(undefined);
    expect(metadata.File).toEqual(undefined);
    expect(metadata.Body).toEqual(CreateTodoRestRequestBody);
  });

  test('Validation properties for new of class CreateTodoRestRequest', async () => {
    const body: CreateTodoRestRequestBody = { title: '', active: true };
    const req = new CreateTodoRestRequest(body);

    expect(req.interpolatedPath).toEqual('/api/v1/todos');
    expect(req.method).toEqual(HttpRequestMethod.POST);
    expect(req.params).toEqual(undefined);
    expect(req.query).toEqual(undefined);
    expect(req.file).toEqual(undefined);
    expect(req.body).toEqual(body);
  });

  // Tests for DeleteTodoRestRequest
  test('Validation metadata of class DeleteTodoRestRequest', async () => {
    const metadata = HttpRestRequestRepository.get(DeleteTodoRestRequest)!;
    expect(metadata.path).toEqual('/api/v1/todos/:id');
    expect(metadata.method).toEqual(HttpRequestMethod.DELETE);
    expect(metadata.Response).toEqual(RestRequestResponseOK);
    expect(metadata.Params).toEqual(GetByIdRestRequestParams);
    expect(metadata.Query).toEqual(undefined);
    expect(metadata.File).toEqual(undefined);
    expect(metadata.Body).toEqual(undefined);
  });

  test('Validation properties for new of class DeleteTodoRestRequest', async () => {
    const params: GetByIdRestRequestParams = { id: 'mockId' };
    const req = new DeleteTodoRestRequest(params);

    expect(req.interpolatedPath).toEqual('/api/v1/todos/mockId');
    expect(req.method).toEqual(HttpRequestMethod.DELETE);
    expect(req.params).toEqual(params);
    expect(req.params.id).toEqual('mockId');
    expect(req.query).toEqual(undefined);
    expect(req.file).toEqual(undefined);
    expect(req.body).toEqual(undefined);
  });

  // Tests for GetTodoRestRequest
  test('Validation metadata of class GetTodoRestRequest', async () => {
    const metadata = HttpRestRequestRepository.get(GetTodoRestRequest)!;
    expect(metadata.path).toEqual('/api/v1/todos/:id');
    expect(metadata.method).toEqual(HttpRequestMethod.GET);
    expect(metadata.Response).toEqual(GetTodoRestRequestResponse);
    expect(metadata.Params).toEqual(GetByIdRestRequestParams);
    expect(metadata.Query).toEqual(undefined);
    expect(metadata.File).toEqual(undefined);
    expect(metadata.Body).toEqual(undefined);
  });

  test('Validation properties for new of class GetTodoRestRequest', async () => {
    const params: GetByIdRestRequestParams = { id: 'mockId' };
    const req = new GetTodoRestRequest(params);

    expect(req.interpolatedPath).toEqual('/api/v1/todos/mockId');
    expect(req.method).toEqual(HttpRequestMethod.GET);
    expect(req.params).toEqual(params);
    expect(req.params.id).toEqual('mockId');
    expect(req.query).toEqual(undefined);
    expect(req.file).toEqual(undefined);
    expect(req.body).toEqual(undefined);
  });

  // Tests for ListTodoRestRequest
  test('Validation metadata of class ListTodoRestRequest', async () => {
    const metadata = HttpRestRequestRepository.get(ListTodoRestRequest)!;
    expect(metadata.path).toEqual('/api/v1/todos');
    expect(metadata.method).toEqual(HttpRequestMethod.GET);
    expect(metadata.Response).toEqual(ListTodoRestRequestResponse);
    expect(metadata.Params).toEqual(undefined);
    expect(metadata.Query).toEqual(ListTodoRestRequestQuery);
    expect(metadata.File).toEqual(undefined);
    expect(metadata.Body).toEqual(undefined);
  });

  test('Validation properties for new of class ListTodoRestRequest', async () => {
    const query: ListTodoRestRequestQuery = {};
    const req = new ListTodoRestRequest(query);

    expect(req.interpolatedPath).toEqual('/api/v1/todos');
    expect(req.method).toEqual(HttpRequestMethod.GET);
    expect(req.params).toEqual(undefined);
    expect(req.query).toEqual(query);
    expect(req.file).toEqual(undefined);
    expect(req.body).toEqual(undefined);
  });

  // Tests for RestoreTodoRestRequest
  test('Validation metadata of class RestoreTodoRestRequest', async () => {
    const metadata = HttpRestRequestRepository.get(RestoreTodoRestRequest)!;
    expect(metadata.path).toEqual('/api/v1/todos/:id/restore');
    expect(metadata.method).toEqual(HttpRequestMethod.PUT);
    expect(metadata.Response).toEqual(RestRequestResponseOK);
    expect(metadata.Params).toEqual(GetByIdRestRequestParams);
    expect(metadata.Query).toEqual(undefined);
    expect(metadata.File).toEqual(undefined);
    expect(metadata.Body).toEqual(undefined);
  });

  test('Validation properties for new of class RestoreTodoRestRequest', async () => {
    const params: GetByIdRestRequestParams = { id: 'mockId' };
    const req = new RestoreTodoRestRequest(params);

    expect(req.interpolatedPath).toEqual('/api/v1/todos/mockId/restore');
    expect(req.method).toEqual(HttpRequestMethod.PUT);
    expect(req.params).toEqual(params);
    expect(req.params.id).toEqual('mockId');
    expect(req.query).toEqual(undefined);
    expect(req.file).toEqual(undefined);
    expect(req.body).toEqual(undefined);
  });

  // Tests for UpdateTodoRestRequest
  test('Validation metadata of class UpdateTodoRestRequest', async () => {
    const metadata = HttpRestRequestRepository.get(UpdateTodoRestRequest)!;
    expect(metadata.path).toEqual('/api/v1/todos/:id');
    expect(metadata.method).toEqual(HttpRequestMethod.PUT);
    expect(metadata.Response).toEqual(UpdateTodoRestRequestResponse);
    expect(metadata.Params).toEqual(GetByIdRestRequestParams);
    expect(metadata.Query).toEqual(undefined);
    expect(metadata.File).toEqual(undefined);
    expect(metadata.Body).toEqual(UpdateTodoRestRequestBody);
  });

  test('Validation properties for new of class UpdateTodoRestRequest', async () => {
    const params: GetByIdRestRequestParams = { id: 'mockId' };
    const body: UpdateTodoRestRequestBody = {};
    const req = new UpdateTodoRestRequest(params, body);

    expect(req.interpolatedPath).toEqual('/api/v1/todos/mockId');
    expect(req.method).toEqual(HttpRequestMethod.PUT);
    expect(req.params).toEqual(params);
    expect(req.params.id).toEqual('mockId');
    expect(req.query).toEqual(undefined);
    expect(req.file).toEqual(undefined);
    expect(req.body).toEqual(body);
  });
});
