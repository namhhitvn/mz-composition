import { ApolloServer } from '@apollo/server';
import { GraphQLResponseBody } from '@apollo/server/src/externalTypes/graphql';
import { FormattedExecutionResult } from 'graphql';
import appGraphqlRouter from '../node-src/graphql.router';
import { connectMongoTest } from '../node-src/main';
import {
  createMockRecordTodo,
  dropCollectionTodo,
  expectRecordEqualTodoGraphql,
  TodoKeys,
} from './todo-model.spec';
import { ObjectLiteral } from '../../lib/interfaces/utils';

describe('Test todo graphql request', function () {
  const mockRecordsToInsert = [
    { title: 'Cardigan Welsh Corgi', active: true },
    { title: 'Maltese', active: false },
    { title: 'Schillerstövare', active: false },
    { title: 'Pont-Audemer Spaniel', active: false },
    { title: 'Cantabrian Water Dog', active: false },
  ];
  const allTodoFields: TodoKeys[] = [
    '_id',
    'title',
    'active',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ];
  let testServer: ApolloServer<any>;

  beforeAll(async () => {
    await connectMongoTest();
    await dropCollectionTodo();

    testServer = new ApolloServer({
      typeDefs: appGraphqlRouter.options.apolloServerOptions.typeDefs,
      resolvers: appGraphqlRouter.options.apolloServerOptions.resolvers,
    });
  });

  it('Call query todoList, should returns todo list empty', async () => {
    const res = await testServer.executeOperation({
      query:
        'query GetTodoList($query: TodoListQuery) { todoList(query: $query) { data { _id } } }',
      variables: { query: {} },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoList');
    expect(res.body.singleResult.data.todoList).toHaveProperty('data');
    expect(res.body.singleResult.data.todoList.data).toBeInstanceOf(Array);
    expect(res.body.singleResult.data.todoList.data.length).toEqual(0);
  });

  it('Call query todoList, should returns todo list with 5 records', async () => {
    await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoList($query: TodoListQuery) { todoList(query: $query) { data { _id, title, active, createdAt, updatedAt, deletedAt } } }',
      variables: { query: {} },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoList');
    expect(res.body.singleResult.data.todoList).toHaveProperty('data');
    expect(res.body.singleResult.data.todoList.data).toBeInstanceOf(Array);
    expect(res.body.singleResult.data.todoList.data.length).toEqual(5);

    for (let i = 0; i < mockRecordsToInsert.length; i++) {
      expectRecordEqualTodoGraphql(
        res.body.singleResult.data.todoList.data[i],
        allTodoFields,
        mockRecordsToInsert[i].title,
        mockRecordsToInsert[i].active,
      );
    }

    await dropCollectionTodo();
  });

  it('Call query todoList, should returns todo list with query keyword "Maltese"', async () => {
    await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoList($query: TodoListQuery) { todoList(query: $query) { data { _id, title, active, createdAt, updatedAt, deletedAt } } }',
      variables: { query: { keyword: 'Maltese' } },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoList');
    expect(res.body.singleResult.data.todoList).toHaveProperty('data');
    expect(res.body.singleResult.data.todoList.data).toBeInstanceOf(Array);
    expect(res.body.singleResult.data.todoList.data.length).toEqual(1);

    expectRecordEqualTodoGraphql(
      res.body.singleResult.data.todoList.data[0],
      allTodoFields,
      mockRecordsToInsert[1].title,
      mockRecordsToInsert[1].active,
    );

    await dropCollectionTodo();
  });

  it('Call query todoList, should returns todo list with query keyword "Maltesexxx"', async () => {
    await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoList($query: TodoListQuery) { todoList(query: $query) { data { _id, title, active, createdAt, updatedAt, deletedAt } } }',
      variables: { query: { keyword: 'Maltesexxx' } },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoList');
    expect(res.body.singleResult.data.todoList).toHaveProperty('data');
    expect(res.body.singleResult.data.todoList.data).toBeInstanceOf(Array);
    expect(res.body.singleResult.data.todoList.data.length).toEqual(0);

    await dropCollectionTodo();
  });

  it('Call query todoList, should returns todo list with query keyword "C"', async () => {
    await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoList($query: TodoListQuery) { todoList(query: $query) { data { _id, title, active, createdAt, updatedAt, deletedAt } } }',
      variables: { query: { keyword: 'c' } },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoList');
    expect(res.body.singleResult.data.todoList).toHaveProperty('data');
    expect(res.body.singleResult.data.todoList.data).toBeInstanceOf(Array);
    expect(res.body.singleResult.data.todoList.data.length).toEqual(3);

    expectRecordEqualTodoGraphql(
      res.body.singleResult.data.todoList.data[0],
      allTodoFields,
      mockRecordsToInsert[0].title,
      mockRecordsToInsert[0].active,
    );

    expectRecordEqualTodoGraphql(
      res.body.singleResult.data.todoList.data[1],
      allTodoFields,
      mockRecordsToInsert[2].title,
      mockRecordsToInsert[2].active,
    );

    expectRecordEqualTodoGraphql(
      res.body.singleResult.data.todoList.data[2],
      allTodoFields,
      mockRecordsToInsert[4].title,
      mockRecordsToInsert[4].active,
    );

    await dropCollectionTodo();
  });

  it('Call query todoList, should returns todo list with query keyword ""', async () => {
    await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoList($query: TodoListQuery) { todoList(query: $query) { data { _id, title, active, createdAt, updatedAt, deletedAt } } }',
      variables: { query: { keyword: '' } },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoList');
    expect(res.body.singleResult.data.todoList).toHaveProperty('data');
    expect(res.body.singleResult.data.todoList.data).toBeInstanceOf(Array);
    expect(res.body.singleResult.data.todoList.data.length).toEqual(5);

    for (let i = 0; i < mockRecordsToInsert.length; i++) {
      expectRecordEqualTodoGraphql(
        res.body.singleResult.data.todoList.data[i],
        allTodoFields,
        mockRecordsToInsert[i].title,
        mockRecordsToInsert[i].active,
      );
    }

    await dropCollectionTodo();
  });

  it('Call query todoList, should returns todo list with select only field "title"', async () => {
    await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoList($query: TodoListQuery) { todoList(query: $query) { data { title } } }',
      variables: { query: {} },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoList');
    expect(res.body.singleResult.data.todoList).toHaveProperty('data');
    expect(res.body.singleResult.data.todoList.data).toBeInstanceOf(Array);
    expect(res.body.singleResult.data.todoList.data.length).toEqual(5);

    for (let i = 0; i < res.body.singleResult.data.todoList.data.length; i++) {
      const record = res.body.singleResult.data.todoList.data[i];
      expect(record).not.toHaveProperty('_id');
      expect(record).toHaveProperty('title');
      expect(record.title).toEqual(mockRecordsToInsert[i].title);
      expect(record).not.toHaveProperty('active');
      expect(record).not.toHaveProperty('createdAt');
      expect(record).not.toHaveProperty('updatedAt');
      expect(record).not.toHaveProperty('deletedAt');
    }

    await dropCollectionTodo();
  });

  it('Call query todoList, should returns todo list with select fields "title" and "createdAt"', async () => {
    await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoList($query: TodoListQuery) { todoList(query: $query) { data { title, createdAt } } }',
      variables: { query: {} },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoList');
    expect(res.body.singleResult.data.todoList).toHaveProperty('data');
    expect(res.body.singleResult.data.todoList.data).toBeInstanceOf(Array);
    expect(res.body.singleResult.data.todoList.data.length).toEqual(5);

    for (let i = 0; i < res.body.singleResult.data.todoList.data.length; i++) {
      const record = res.body.singleResult.data.todoList.data[i];
      expect(record).not.toHaveProperty('_id');
      expect(record).toHaveProperty('title');
      expect(record.title).toEqual(mockRecordsToInsert[i].title);
      expect(record).not.toHaveProperty('active');
      expect(record).toHaveProperty('createdAt');
      expect(record).not.toHaveProperty('updatedAt');
      expect(record).not.toHaveProperty('deletedAt');
    }

    await dropCollectionTodo();
  });

  it('Call query todoList, should returns todo list with select only field "_id"', async () => {
    await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoList($query: TodoListQuery) { todoList(query: $query) { data { _id } } }',
      variables: { query: {} },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoList');
    expect(res.body.singleResult.data.todoList).toHaveProperty('data');
    expect(res.body.singleResult.data.todoList.data).toBeInstanceOf(Array);
    expect(res.body.singleResult.data.todoList.data.length).toEqual(5);

    for (let i = 0; i < res.body.singleResult.data.todoList.data.length; i++) {
      const record = res.body.singleResult.data.todoList.data[i];
      expect(record).toHaveProperty('_id');
      expect(record).not.toHaveProperty('title');
      expect(record).not.toHaveProperty('active');
      expect(record).not.toHaveProperty('createdAt');
      expect(record).not.toHaveProperty('updatedAt');
      expect(record).not.toHaveProperty('deletedAt');
    }

    await dropCollectionTodo();
  });

  it('Call query todoDetail, should returns todo with exist id', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoDetail($id: ID!) { todoDetail(id: $id) { _id, title, active, createdAt, updatedAt, deletedAt } }',
      variables: { id: recordIds[0] },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoDetail');

    expectRecordEqualTodoGraphql(
      res.body.singleResult.data.todoDetail,
      allTodoFields,
      mockRecordsToInsert[0].title,
      mockRecordsToInsert[0].active,
    );

    await dropCollectionTodo();
  });

  it('Call query todoDetail, should returns todo with exist id other', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoDetail($id: ID!) { todoDetail(id: $id) { _id, title, active, createdAt, updatedAt, deletedAt } }',
      variables: { id: recordIds[1] },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoDetail');

    expectRecordEqualTodoGraphql(
      res.body.singleResult.data.todoDetail,
      allTodoFields,
      mockRecordsToInsert[1].title,
      mockRecordsToInsert[1].active,
    );

    await dropCollectionTodo();
  });

  it('Call query todoDetail, should returns todo = null with not exist id', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoDetail($id: ID!) { todoDetail(id: $id) { _id, title, active, createdAt, updatedAt, deletedAt } }',
      variables: { id: recordIds[0] + 'xxx' },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoDetail');
    expect(res.body.singleResult.data.todoDetail).toEqual(null);

    await dropCollectionTodo();
  });

  it('Call query todoDetail, should returns todo with exist id and select only field "_id"', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query: 'query GetTodoDetail($id: ID!) { todoDetail(id: $id) { _id } }',
      variables: { id: recordIds[0] },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoDetail');
    expect(res.body.singleResult.data.todoDetail).toHaveProperty('_id');
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty('title');
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty('active');
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty(
      'createdAt',
    );
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty(
      'updatedAt',
    );
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty(
      'deletedAt',
    );

    await dropCollectionTodo();
  });

  it('Call query todoDetail, should returns todo with exist id and select only field "title"', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query: 'query GetTodoDetail($id: ID!) { todoDetail(id: $id) { title } }',
      variables: { id: recordIds[0] },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoDetail');
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty('_id');
    expect(res.body.singleResult.data.todoDetail).toHaveProperty('title');
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty('active');
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty(
      'createdAt',
    );
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty(
      'updatedAt',
    );
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty(
      'deletedAt',
    );

    await dropCollectionTodo();
  });

  it('Call query todoDetail, should returns todo with exist id and select fields "title" and "active"', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'query GetTodoDetail($id: ID!) { todoDetail(id: $id) { title, active } }',
      variables: { id: recordIds[0] },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoDetail');
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty('_id');
    expect(res.body.singleResult.data.todoDetail).toHaveProperty('title');
    expect(res.body.singleResult.data.todoDetail).toHaveProperty('active');
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty(
      'createdAt',
    );
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty(
      'updatedAt',
    );
    expect(res.body.singleResult.data.todoDetail).not.toHaveProperty(
      'deletedAt',
    );

    await dropCollectionTodo();
  });

  it('Call mutation todoCreate, should returns todo just create', async () => {
    const res = await testServer.executeOperation({
      query:
        'mutation TodoCreate($body: TodoBodyCreate!) { todoCreate(body: $body) { _id, title, active } }',
      variables: { body: { title: 'hello world' } },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoCreate');
    expect(res.body.singleResult.data.todoCreate).toHaveProperty('_id');
    expect(res.body.singleResult.data.todoCreate).toHaveProperty('title');
    expect(res.body.singleResult.data.todoCreate.title).toEqual('hello world');
    expect(res.body.singleResult.data.todoCreate).toHaveProperty('active');
    expect(res.body.singleResult.data.todoCreate.active).toEqual(false);

    await dropCollectionTodo();
  });

  it('Call mutation todoCreate, should returns todo just create with active = true', async () => {
    const res = await testServer.executeOperation({
      query:
        'mutation TodoCreate($body: TodoBodyCreate!) { todoCreate(body: $body) { _id, title, active } }',
      variables: { body: { title: 'xin chào thế giới', active: true } },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoCreate');
    expect(res.body.singleResult.data.todoCreate).toHaveProperty('_id');
    expect(res.body.singleResult.data.todoCreate).toHaveProperty('title');
    expect(res.body.singleResult.data.todoCreate.title).toEqual(
      'xin chào thế giới',
    );
    expect(res.body.singleResult.data.todoCreate).toHaveProperty('active');
    expect(res.body.singleResult.data.todoCreate.active).toEqual(true);

    await dropCollectionTodo();
  });

  it('Call mutation todoDelete, should returns todoDelete = true with exist record', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query: 'mutation TodoDelete($id: ID!) { todoDelete(id: $id) }',
      variables: { id: recordIds[0] },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoDelete');
    expect(res.body.singleResult.data.todoDelete).toEqual(true);

    await dropCollectionTodo();
  });

  it('Call mutation todoDelete, should returns todoDelete = true with not exist record', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query: 'mutation TodoDelete($id: ID!) { todoDelete(id: $id) }',
      variables: { id: recordIds[0] + 'xxx' },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoDelete');
    expect(res.body.singleResult.data.todoDelete).toEqual(true);

    await dropCollectionTodo();
  });

  it('Call mutation todoRestore, should returns todoRestore = true with exist record', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query: 'mutation TodoRestore($id: ID!) { todoRestore(id: $id) }',
      variables: { id: recordIds[0] },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoRestore');
    expect(res.body.singleResult.data.todoRestore).toEqual(true);

    await dropCollectionTodo();
  });

  it('Call mutation todoRestore, should returns todoRestore = true with not exist record', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query: 'mutation TodoRestore($id: ID!) { todoRestore(id: $id) }',
      variables: { id: recordIds[0] + 'xxx' },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoRestore');
    expect(res.body.singleResult.data.todoRestore).toEqual(true);

    await dropCollectionTodo();
  });

  it('Call mutation todoUpdate, should returns todo with value updated', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'mutation TodoUpdate($id: ID!, $body: TodoBodyUpdate!) { todoUpdate(id: $id, body: $body) { _id, title, active } }',
      variables: { id: recordIds[0], body: { title: 'hello world' } },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoUpdate');
    expect(res.body.singleResult.data.todoUpdate).toHaveProperty('_id');
    expect(res.body.singleResult.data.todoUpdate).toHaveProperty('title');
    expect(res.body.singleResult.data.todoUpdate.title).toEqual('hello world');
    expect(res.body.singleResult.data.todoUpdate).toHaveProperty('active');
    expect(res.body.singleResult.data.todoUpdate.active).toEqual(true);

    await dropCollectionTodo();
  });

  it('Call mutation todoUpdate, should returns todo with value updated 2', async () => {
    const { recordIds } = await createMockRecordTodo(mockRecordsToInsert);

    const res = await testServer.executeOperation({
      query:
        'mutation TodoUpdate($id: ID!, $body: TodoBodyUpdate!) { todoUpdate(id: $id, body: $body) { _id, title, active } }',
      variables: {
        id: recordIds[0],
        body: { title: 'xin chào thế giới', active: false },
      },
    });

    assertSingle(res.body);
    expect(res.body.singleResult.data).toHaveProperty('todoUpdate');
    expect(res.body.singleResult.data.todoUpdate).toHaveProperty('_id');
    expect(res.body.singleResult.data.todoUpdate).toHaveProperty('title');
    expect(res.body.singleResult.data.todoUpdate.title).toEqual(
      'xin chào thế giới',
    );
    expect(res.body.singleResult.data.todoUpdate).toHaveProperty('active');
    expect(res.body.singleResult.data.todoUpdate.active).toEqual(false);

    await dropCollectionTodo();
  });
});

function assertSingle(target: GraphQLResponseBody<any>): asserts target is {
  kind: 'single';
  singleResult: Pick<FormattedExecutionResult<any>, 'errors' | 'extensions'> & {
    data: ObjectLiteral;
  };
} {
  expect(target.kind).toEqual('single');
}
