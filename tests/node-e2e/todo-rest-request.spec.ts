import { HttpRequestMethod, HttpRestRequestRepository } from '../../lib/core';
import {
  CreateTodoRestRequest,
  CreateTodoRestRequestBody,
  CreateTodoRestRequestResponse,
} from '../node-src/shared/rest/todo/create-todo';

describe('Test todo rest request', function () {
  test('Should exist CreateTodoRestRequest in HttpRestRequestRepository', async () => {
    const has = HttpRestRequestRepository.has(CreateTodoRestRequest);
    expect(has).toEqual(true);
  });

  test('Validation metadata of CreateTodoRestRequest by HttpRestRequestRepository', async () => {
    const metadata = HttpRestRequestRepository.get(CreateTodoRestRequest)!;

    expect(metadata.path).toEqual('/api/v1/todos');
    expect(metadata.method).toEqual(HttpRequestMethod.POST);
    expect(metadata.Response).toEqual(CreateTodoRestRequestResponse);
    expect(metadata.Params).toEqual(undefined);
    expect(metadata.Query).toEqual(undefined);
    expect(metadata.File).toEqual(undefined);
    expect(metadata.Body).toEqual(CreateTodoRestRequestBody);
  });

  test('Should requirement parameter when new CreateTodoRestRequest', async () => {
    const body = { title: '', active: true };
    const req = new CreateTodoRestRequest(body);

    expect(req.interpolatedPath).toEqual('/api/v1/todos');
    expect(req.method).toEqual(HttpRequestMethod.POST);
    expect(req.params).toEqual(undefined);
    expect(req.query).toEqual(undefined);
    expect(req.file).toEqual(undefined);
    expect(req.body).toEqual(body);
  });
});
