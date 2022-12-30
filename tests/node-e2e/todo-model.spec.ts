import mongoose from 'mongoose';

import { connectMongoTest } from '../node-src/main';
import { Todo, TodoModel } from '../node-src/shared';
import { toString } from 'lodash';
import { WithRequired } from '../../lib';

describe('Test todo model', function () {
  let mongoConnection: mongoose.Connection;
  let todoModel: ReturnType<typeof TodoModel>;

  beforeAll(async () => {
    mongoConnection = await connectMongoTest();
    await dropCollectionTodo();

    todoModel = TodoModel();
  });

  test('TodoModel builder should have method to filter all field has defined in schema', async () => {
    const qb = todoModel.createQueryBuilder();

    expect(qb).toHaveProperty('filterTitle');
    expect(qb).not.toHaveProperty('filtertitle');
    expect(qb).not.toHaveProperty('filter_title');
    expect(qb).not.toHaveProperty('filter-title');
    expect(qb).not.toHaveProperty('filter title');

    expect(qb).toHaveProperty('filterActive');
    expect(qb).not.toHaveProperty('filteractive');
    expect(qb).not.toHaveProperty('filter_active');
    expect(qb).not.toHaveProperty('filter-active');
    expect(qb).not.toHaveProperty('filter active');

    expect(qb).toHaveProperty('filterCreatedAt');
    expect(qb).not.toHaveProperty('filtercreatedAt');
    expect(qb).not.toHaveProperty('filtercreatedat');
    expect(qb).not.toHaveProperty('filter_created_at');
    expect(qb).not.toHaveProperty('filter-created-at');
    expect(qb).not.toHaveProperty('filter created at');

    expect(qb).toHaveProperty('filterUpdatedAt');
    expect(qb).not.toHaveProperty('filterupdatedAt');
    expect(qb).not.toHaveProperty('filterupdatedat');
    expect(qb).not.toHaveProperty('filter_updated_at');
    expect(qb).not.toHaveProperty('filter-updated-at');
    expect(qb).not.toHaveProperty('filter updated at');

    expect(qb).toHaveProperty('filterDeletedAt');
    expect(qb).not.toHaveProperty('filterdeletedAt');
    expect(qb).not.toHaveProperty('filterdeletedat');
    expect(qb).not.toHaveProperty('filter_deleted_at');
    expect(qb).not.toHaveProperty('filter-deleted-at');
    expect(qb).not.toHaveProperty('filter deleted at');
  });

  test('TodoModel schema properties type', async () => {
    const schema = todoModel.getModel().schema.obj as {
      [key: string]: { type: any };
    };

    expect(schema.title.type).toEqual(String);
    expect(schema.active.type).toEqual(Boolean);
    expect(schema.createdAt.type).toEqual(Date);
    expect(schema.updatedAt.type).toEqual(Date);
    expect(schema.deletedAt.type).toEqual(Date);
  });

  test('TodoModel CRUD record', async () => {
    const todo = await todoModel
      .createQueryBuilder()
      .values({ title: 'hello world', active: true })
      .insert();
    expectRecordEqualTodoDocument(todo.data, 'hello world', true);

    const todoFindAfterInsert = await todoModel
      .createQueryBuilder()
      .filterObjectId(toString(todo.data._id))
      .findOne();
    expectRecordEqualTodoDocument(
      todoFindAfterInsert.data,
      'hello world',
      true,
    );

    const todoUpdated = await todoModel
      .createQueryBuilder()
      .filterObjectId(toString(todo.data._id))
      .values({ title: 'xin chào thế giới' })
      .update();
    expectRecordEqualTodoDocument(todoUpdated.data, 'xin chào thế giới', true);

    const todoSoftRemoved = await todoModel
      .createQueryBuilder()
      .filterObjectId(toString(todo.data._id))
      .softDelete();
    expectRecordEqualTodoDocument(
      todoSoftRemoved.data,
      'xin chào thế giới',
      true,
    );
    expect(typeof todoSoftRemoved.data.deletedAt).toBe('object');
    expect(todoSoftRemoved.data.deletedAt).toBeInstanceOf(Date);
    expect(todoSoftRemoved.data.deletedAt!.toString()).not.toEqual(
      'Invalid Date',
    );

    const todoRestored = await todoModel
      .createQueryBuilder()
      .filterObjectId(toString(todo.data._id))
      .restore();
    expectRecordEqualTodoDocument(todoRestored.data, 'xin chào thế giới', true);
    expect(typeof todoRestored.data.deletedAt).toBe('undefined');

    const todoHardRemoved = await todoModel
      .createQueryBuilder()
      .filterObjectId(toString(todo.data._id))
      .delete();
    expect(todoHardRemoved.data).toHaveProperty('acknowledged');
    expect(todoHardRemoved.data).toHaveProperty('deletedCount');

    const todoFindAfterRemoved = await todoModel
      .createQueryBuilder()
      .filterObjectId(toString(todo.data._id))
      .findOne();
    expect(todoFindAfterRemoved.data).not.toHaveProperty('_id');
  });

  test('TodoModel find records should exist column "title"', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'hello world', active: true },
      { title: 'xin chào thế giới', active: false },
    ]);

    const todos = await todoModel
      .createQueryBuilder()
      .selectFields({ title: 1 })
      .find();

    expect(todos.data.length).toEqual(2);

    expect(toString(todos.data[0]._id)).toEqual(recordIds[0]);
    expect(todos.data[0].title).toEqual('hello world');
    expect(todos.data[0].active).toEqual(undefined);
    expect(Object.keys(todos.data[0]).length).toEqual(2);
    expect(Object.keys(todos.data[0])).toContainEqual;
    expect(todos.data[0]).toEqual({
      _id: todoModel.parseObjectId(recordIds[0]),
      title: 'hello world',
    });

    expect(toString(todos.data[1]._id)).toEqual(recordIds[1]);
    expect(todos.data[1].title).toEqual('xin chào thế giới');
    expect(todos.data[1].active).toEqual(undefined);
    expect(Object.keys(todos.data[0]).length).toEqual(2);
    expect(todos.data[1]).toEqual({
      _id: todoModel.parseObjectId(recordIds[1]),
      title: 'xin chào thế giới',
    });

    await cleanMock();
  });

  test('TodoModel find records should exist column "active"', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'hello world', active: true },
      { title: 'xin chào thế giới', active: false },
    ]);

    const todos = await todoModel
      .createQueryBuilder()
      .selectFields({ active: 1 })
      .find();

    expect(todos.data.length).toEqual(2);

    expect(toString(todos.data[0]._id)).toEqual(recordIds[0]);
    expect(todos.data[0].title).toEqual(undefined);
    expect(todos.data[0].active).toEqual(true);
    expect(Object.keys(todos.data[0]).length).toEqual(2);
    expect(todos.data[0]).toEqual({
      _id: todoModel.parseObjectId(recordIds[0]),
      active: true,
    });

    expect(toString(todos.data[1]._id)).toEqual(recordIds[1]);
    expect(todos.data[1].title).toEqual(undefined);
    expect(todos.data[1].active).toEqual(false);
    expect(Object.keys(todos.data[0]).length).toEqual(2);
    expect(todos.data[1]).toEqual({
      _id: todoModel.parseObjectId(recordIds[1]),
      active: false,
    });

    await cleanMock();
  });

  test('TodoModel find records with count should return [[Todo], 1]', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'hello world', active: true },
    ]);

    const {
      data: [records, count],
    } = await todoModel.createQueryBuilder().findAndCount();

    expect(count).toEqual(1);
    expect(records.length).toEqual(1);
    expect(records[0]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[0]),
      title: 'hello world',
      active: true,
    });

    await cleanMock();
  });

  test('TodoModel find records with count should return [[Todo, Todo], 2]', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'hello world', active: true },
      { title: 'xin chào thế giới', active: false },
    ]);

    const {
      data: [records, count],
    } = await todoModel.createQueryBuilder().findAndCount();

    expect(count).toEqual(2);
    expect(records.length).toEqual(2);
    expect(records[0]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[0]),
      title: 'hello world',
      active: true,
    });
    expect(records[1]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[0]),
      title: 'xin chào thế giới',
      active: false,
    });

    await cleanMock();
  });

  test('TodoModel find records with count with limit 1 page 1 should return [[Todo], 5]', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    const {
      data: [records, count],
    } = await todoModel.createQueryBuilder().setPage(1, 1).findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(1);
    expect(records[0]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[0]),
      title: 'Cardigan Welsh Corgi',
      active: true,
    });

    await cleanMock();
  });

  test('TodoModel find records with count with limit 1 page 2 should return [[Todo], 5]', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    const {
      data: [records, count],
    } = await todoModel.createQueryBuilder().setPage(2, 1).findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(1);
    expect(records[0]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[1]),
      title: 'Maltese',
      active: false,
    });

    await cleanMock();
  });

  test('TodoModel find records with count with limit 1 page 3 should return [[Todo], 5]', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    const {
      data: [records, count],
    } = await todoModel.createQueryBuilder().setPage(3, 1).findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(1);
    expect(records[0]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[2]),
      title: 'Schillerstövare',
      active: false,
    });

    await cleanMock();
  });

  test('TodoModel find records with count with limit 2 page 1 should return [[Todo, Todo], 5]', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    const {
      data: [records, count],
    } = await todoModel.createQueryBuilder().setPage(1, 2).findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(2);
    expect(records[0]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[0]),
      title: 'Cardigan Welsh Corgi',
      active: true,
    });
    expect(records[1]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[1]),
      title: 'Maltese',
      active: false,
    });

    await cleanMock();
  });

  test('TodoModel find records with count with limit 2 page 2 should return [[Todo, Todo], 5]', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    const {
      data: [records, count],
    } = await todoModel.createQueryBuilder().setPage(2, 2).findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(2);
    expect(records[0]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[2]),
      title: 'Schillerstövare',
      active: false,
    });
    expect(records[1]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[3]),
      title: 'Pont-Audemer Spaniel',
      active: false,
    });

    await cleanMock();
  });

  test('TodoModel find records with count with limit 2 page 3 should return [[Todo], 5]', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    const {
      data: [records, count],
    } = await todoModel.createQueryBuilder().setPage(3, 2).findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(1);
    expect(records[0]).toMatchObject({
      _id: todoModel.parseObjectId(recordIds[4]),
      title: 'Cantabrian Water Dog',
      active: false,
    });

    await cleanMock();
  });

  test('TodoModel find records with count with limit 2 page 4 should return [[], 5]', async () => {
    const { clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    const {
      data: [records, count],
    } = await todoModel.createQueryBuilder().setPage(4, 2).findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(0);

    await cleanMock();
  });

  test('TodoModel update many column active', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    await todoModel
      .createQueryBuilder()
      .filterIds(recordIds)
      .values({ active: true })
      .updateMany();
    const {
      data: [records, count],
    } = await todoModel
      .createQueryBuilder()
      .selectFields({ active: 1 })
      .filterIds(recordIds)
      .findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(5);

    for (let i = 0; i < records.length; i++) {
      expect(records[i].active).toEqual(true);
    }

    await cleanMock();
  });

  test('TodoModel update many column title', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    await todoModel
      .createQueryBuilder()
      .filterIds(recordIds)
      .values({ title: 'hihi' })
      .updateMany();
    const {
      data: [records, count],
    } = await todoModel
      .createQueryBuilder()
      .selectFields({ title: 1 })
      .filterIds(recordIds)
      .findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(5);

    for (let i = 0; i < records.length; i++) {
      expect(records[i].title).toEqual('hihi');
    }

    await cleanMock();
  });

  test('TodoModel delete many', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    await todoModel.createQueryBuilder().filterIds(recordIds).deleteMany();
    const {
      data: [records, count],
    } = await todoModel
      .createQueryBuilder()
      .filterIds(recordIds)
      .findAndCount();

    expect(count).toEqual(0);
    expect(records.length).toEqual(0);

    await cleanMock();
  });

  test('TodoModel soft delete many', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    await todoModel.createQueryBuilder().filterIds(recordIds).softDeleteMany();
    const {
      data: [records, count],
    } = await todoModel
      .createQueryBuilder()
      .filterIds(recordIds)
      .findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(5);

    for (let i = 0; i < records.length; i++) {
      expect(records[i].deletedAt!.toString()).not.toEqual('Invalid Date');
    }

    await cleanMock();
  });

  test('TodoModel restore many', async () => {
    const { recordIds, clean: cleanMock } = await createMockRecordTodo([
      { title: 'Cardigan Welsh Corgi', active: true },
      { title: 'Maltese', active: false },
      { title: 'Schillerstövare', active: false },
      { title: 'Pont-Audemer Spaniel', active: false },
      { title: 'Cantabrian Water Dog', active: false },
    ]);

    await todoModel.createQueryBuilder().filterIds(recordIds).softDeleteMany();
    await todoModel.createQueryBuilder().filterIds(recordIds).restoreMany();
    const {
      data: [records, count],
    } = await todoModel
      .createQueryBuilder()
      .filterIds(recordIds)
      .findAndCount();

    expect(count).toEqual(5);
    expect(records.length).toEqual(5);

    for (let i = 0; i < records.length; i++) {
      expect(records[i].deletedAt).toEqual(undefined);
    }

    await cleanMock();
  });
});

export async function createMockRecordTodo(
  todos: WithRequired<Todo, 'title'>[],
) {
  const todoModel = TodoModel();
  const qb = await todoModel.createQueryBuilder().values(todos).insertMany();
  const ids = qb.data.map((v) => toString(v._id));

  return {
    records: qb.data,
    recordIds: ids,
    clean: async () => {
      await todoModel.createQueryBuilder().filterIds(ids).deleteMany();
    },
  };
}

export function expectRecordEqualTodoJSON(
  record: any,
  titleEqual?: string | undefined,
  activeEqual?: boolean,
) {
  expect(record).toBeInstanceOf(Object);

  expect(record).toHaveProperty('_id');
  expect(record).toHaveProperty('title');
  expect(record).toHaveProperty('active');
  expect(record).toHaveProperty('createdAt');
  expect(record).toHaveProperty('updatedAt');

  expect(typeof record._id).toBe('string');
  expect(typeof record.title).toBe('string');
  expect(typeof record.active).toBe('boolean');
  expect(typeof record.createdAt).toBe('string');
  expect(typeof record.updatedAt).toBe('string');

  expect(new Date(record.createdAt).toString()).not.toEqual('Invalid Date');
  expect(new Date(record.updatedAt).toString()).not.toEqual('Invalid Date');

  if (record.deletedAt !== undefined) {
    expect(typeof record.deletedAt).toBe('string');
    expect(new Date(record.deletedAt).toString()).not.toEqual('Invalid Date');
  }

  if (titleEqual !== undefined) {
    expect(record.title).toEqual(titleEqual);
  }

  if (activeEqual !== undefined) {
    expect(record.active).toEqual(activeEqual);
  }
}

export function expectRecordEqualTodoDocument(
  record: any,
  titleEqual?: string | undefined,
  activeEqual?: boolean,
) {
  expect(record).toBeInstanceOf(Object);

  expect(record).toHaveProperty('_id');
  expect(record).toHaveProperty('title');
  expect(record).toHaveProperty('active');
  expect(record).toHaveProperty('createdAt');
  expect(record).toHaveProperty('updatedAt');

  expect(typeof record._id).toBe('object');
  expect(typeof record.title).toBe('string');
  expect(typeof record.active).toBe('boolean');
  expect(typeof record.createdAt).toBe('object');
  expect(typeof record.updatedAt).toBe('object');

  expect(record.createdAt).toBeInstanceOf(Date);
  expect(record.updatedAt).toBeInstanceOf(Date);
  expect(record.createdAt.toString()).not.toEqual('Invalid Date');
  expect(record.updatedAt.toString()).not.toEqual('Invalid Date');

  if (record.deletedAt !== undefined) {
    expect(typeof record.deletedAt).toBe('object');
    expect(record.deletedAt).toBeInstanceOf(Date);
    expect(record.deletedAt.toString()).not.toEqual('Invalid Date');
  }

  if (titleEqual !== undefined) {
    expect(record.title).toEqual(titleEqual);
  }

  if (activeEqual !== undefined) {
    expect(record.active).toEqual(activeEqual);
  }
}

export async function dropCollectionTodo() {
  const mongoConnection = await connectMongoTest();
  try {
    await mongoConnection.db.dropCollection('Todo');
  } catch (error) {}
}
