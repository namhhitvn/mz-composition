import { MZRestRouter } from '../../lib/node';

import todoRestRouter from './module/todo-rest/todo.router';

export const appRestRouter = new MZRestRouter();

appRestRouter.addRouter(todoRestRouter);

export default appRestRouter;
