import { MZRestRouter } from '../../../../lib/node';
import {
  CreateTodoRestRequest,
  DeleteTodoRestRequest,
  GetTodoRestRequest,
  ListTodoRestRequest,
  RestoreTodoRestRequest,
  UpdateTodoRestRequest
} from '../../shared';
import { CreateTodoController } from './controller/create-todo.controller';
import { DeleteTodoController } from './controller/delete-todo.controller';
import { GetTodoController } from './controller/get-todo.controller';
import { ListTodoController } from './controller/list-todo.controller';
import { RestoreTodoController } from './controller/restore-todo.controller';
import { UpdateTodoController } from './controller/update-todo.controller';

export const todoRestRouter = new MZRestRouter();

todoRestRouter
  .addRoute(CreateTodoRestRequest, CreateTodoController)
  .addRoute(DeleteTodoRestRequest, DeleteTodoController)
  .addRoute(GetTodoRestRequest, GetTodoController)
  .addRoute(ListTodoRestRequest, ListTodoController)
  .addRoute(RestoreTodoRestRequest, RestoreTodoController)
  .addRoute(UpdateTodoRestRequest, UpdateTodoController);

export default todoRestRouter;
