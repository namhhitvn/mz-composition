import mongoose from 'mongoose';

import { connectMongoTest } from '../node-src/main';
import { TodoModel } from '../node-src/shared';

describe('Test todo model', function () {
  let mongoConnection: mongoose.Connection;
  let todoModel: ReturnType<typeof TodoModel>;

  beforeAll(async () => {
    mongoConnection = await connectMongoTest();
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
});
