import { MZRouterRest } from '../../../../lib/node';
import {
  CreateTodoRestRequest,
  DeleteTodoRestRequest,
  GetTodoRestRequest,
  ListTodoRestRequest,
  RestoreTodoRestRequest,
  UpdateTodoRestRequest,
} from '../../shared';
import { ListTodoController } from './controller/list-todo.controller';
import { CreateTodoController } from './controller/create-todo.controller';
import { DeleteTodoController } from './controller/delete-todo.controller';
import { GetTodoController } from './controller/get-todo.controller';
import { RestoreTodoController } from './controller/restore-todo.controller';
import { UpdateTodoController } from './controller/update-todo.controller';

export const todoRest = new MZRouterRest();

todoRest.handle(CreateTodoRestRequest, CreateTodoController);
todoRest.handle(DeleteTodoRestRequest, DeleteTodoController);
todoRest.handle(GetTodoRestRequest, GetTodoController);
todoRest.handle(ListTodoRestRequest, ListTodoController);
todoRest.handle(RestoreTodoRestRequest, RestoreTodoController);
todoRest.handle(UpdateTodoRestRequest, UpdateTodoController);

export default todoRest;
