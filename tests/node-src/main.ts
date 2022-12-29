import {
  appBootstrap,
  connectMongo,
  MZRestResponseInterceptor,
} from '../../lib/node';

import todoRest from './module/todo/todo-router';

export async function connectMongoTest() {
  return await connectMongo({
    uri: 'mongodb://root:root@localhost:27017/admin',
    connectOptions: {
      user: 'root',
      pass: 'root',
      dbName: 'test',
    },
  });
}

const app = appBootstrap(
  {
    useRouters: [todoRest],
    useInterceptors: [new MZRestResponseInterceptor()],
  },
  () => {
    connectMongoTest();
  },
);

export default app;
