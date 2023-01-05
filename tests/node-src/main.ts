import mongoose from 'mongoose';
import {
  appBootstrap,
  connectMongo,
  MZRestResponseInterceptor,
} from '../../lib/node';

import appGraphqlRouter from './graphql.router';
import appRestRouter from './rest.router';

let mongoTestConnection: mongoose.Connection;
export async function connectMongoTest() {
  if (mongoTestConnection) {
    return mongoTestConnection;
  }

  mongoTestConnection = await connectMongo({
    uri: 'mongodb://root:root@localhost:27017/admin',
    connectOptions: {
      user: 'root',
      pass: 'root',
      dbName: 'test',
    },
  });

  return mongoTestConnection;
}

const app = appBootstrap(
  {
    useRouters: [appGraphqlRouter, appRestRouter],
    useInterceptors: [new MZRestResponseInterceptor()],
  },
  () => {
    connectMongoTest();
  },
);

export default app;
