import { GraphqlResolver } from '../../interfaces';
import { TodoCreateController } from './controller/todo-create.controller';
import { TodoDeleteController } from './controller/todo-delete.controller';
import { TodoDetailController } from './controller/todo-detail.controller';
import { TodoListController } from './controller/todo-list.controller';
import { TodoRestoreController } from './controller/todo-restore.controller';
import { TodoUpdateController } from './controller/todo-update.controller';

export const graphqlTodoResolver: GraphqlResolver.Resolvers = {
  Query: {
    todoDetail: new TodoDetailController().handle,
    todoList: new TodoListController().handle,
  },
  Mutation: {
    todoCreate: new TodoCreateController().handle,
    todoDelete: new TodoDeleteController().handle,
    todoRestore: new TodoRestoreController().handle,
    todoUpdate: new TodoUpdateController().handle,
  },
};
