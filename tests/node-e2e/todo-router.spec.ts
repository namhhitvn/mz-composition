import mongoose from 'mongoose';
import * as request from 'supertest';
import { HttpStatusCode } from '../../lib';

import app, { connectMongoTest } from '../node-src/main';
import {
  dropCollectionTodo,
  expectRecordEqualTodoJSON,
} from './todo-model.spec';

describe('Test todo router', function () {
  let mongoConnection: mongoose.Connection;
  let todoIdTmp: string = 'mockId';

  beforeAll(async () => {
    mongoConnection = await connectMongoTest();
    await dropCollectionTodo();
  });

  test('Call GET /todo, should response 404', async () => {
    const response = await request(app).get('/todo');

    expect(response.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
  });

  test('Call GET /api/todo, should response 404', async () => {
    const response = await request(app).get('/api/todo');

    expect(response.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
  });

  test('Call GET /api/v1/todo, should response 404', async () => {
    const response = await request(app).get('/api/v1/todo');

    expect(response.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
  });

  test('Call GET /api/v1/todos, should response todo list empty', async () => {
    const response = await request(app).get('/api/v1/todos');

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toEqual(0);
    expect(response.statusCode).toEqual(HttpStatusCode.OK);
  });

  test('Call POST /api/v1/todos, should response new todo just created', async () => {
    const response = await request(app)
      .post('/api/v1/todos')
      .set('Content-Type', 'application/json')
      .send({
        title: 'hello world',
        active: true,
      });

    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toEqual(HttpStatusCode.CREATED);
    expectRecordEqualTodoJSON(response.body.data, 'hello world', true);

    todoIdTmp = response.body.data._id;
  });

  test('Call GET /api/v1/todos, should response todo list with one record has been created above', async () => {
    const response = await request(app).get('/api/v1/todos');

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toEqual(1);
    expect(response.statusCode).toEqual(HttpStatusCode.OK);
    expectRecordEqualTodoJSON(response.body.data[0], 'hello world', true);
  });

  test('Call GET /api/v1/todos/:id, should response todo', async () => {
    const response = await request(app).get(`/api/v1/todos/${todoIdTmp}`);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toEqual(HttpStatusCode.OK);
    expectRecordEqualTodoJSON(response.body.data, 'hello world', true);
  });

  test('Call PUT /api/v1/todos/:id, should update todo from title "hello world" to "hello world !!!"', async () => {
    const response = await request(app)
      .put(`/api/v1/todos/${todoIdTmp}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'hello world !!!',
      });

    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toEqual(HttpStatusCode.OK);
    expectRecordEqualTodoJSON(response.body.data, 'hello world !!!', true);
  });

  test('Call PUT /api/v1/todos/:id, should update todo from title "hello world" to "hello world updated"', async () => {
    const response = await request(app)
      .put(`/api/v1/todos/${todoIdTmp}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'hello world updated',
      });

    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toEqual(HttpStatusCode.OK);
    expectRecordEqualTodoJSON(response.body.data, 'hello world updated', true);
  });

  test('Call DELETE /api/v1/todos/:id, should soft remove record todo', async () => {
    const response = await request(app).delete(`/api/v1/todos/${todoIdTmp}`);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toEqual(HttpStatusCode.OK);
    expect(response.body.data).toBeInstanceOf(Object);
    expect(typeof response.body.data.ok).toBe('boolean');
    expect(response.body.data.ok).toEqual(true);
  });

  test('Call GET /api/v1/todos/:id, should response todo with field deletedAt', async () => {
    const response = await request(app).get(`/api/v1/todos/${todoIdTmp}`);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toEqual(HttpStatusCode.OK);
    expectRecordEqualTodoJSON(response.body.data, 'hello world updated', true);
  });

  test('Call PUT /api/v1/todos/${todoIdTmp}/restore, should restore todo deleted', async () => {
    const response = await request(app).put(
      `/api/v1/todos/${todoIdTmp}/restore`,
    );

    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toEqual(HttpStatusCode.OK);
    expect(response.body.data).toBeInstanceOf(Object);
    expect(typeof response.body.data.ok).toBe('boolean');
    expect(response.body.data.ok).toEqual(true);
  });

  test('Call GET /api/v1/todos/:id, should response todo with field deletedAt equal undefined', async () => {
    const response = await request(app).get(`/api/v1/todos/${todoIdTmp}`);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toEqual(HttpStatusCode.OK);
    expect(typeof response.body.data.deletedAt).toBe('undefined');
    expectRecordEqualTodoJSON(response.body.data, 'hello world updated', true);
  });
});
