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
    expect(qb).toHaveProperty('filterActive');
    expect(qb).toHaveProperty('filterCreatedAt');
    expect(qb).toHaveProperty('filterUpdatedAt');
    expect(qb).toHaveProperty('filterDeletedAt');
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
