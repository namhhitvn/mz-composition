import * as path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { merge } from 'lodash';
import { graphqlTodoResolver } from './module/todo-graphql/todo.resolver';
import { GraphqlResolver } from './interfaces';
import { MZGraphqlRouter } from '../../lib/node';

const graphqlTypeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, './typedefs/_final-schema.graphql')),
);
const graphqlResolvers: GraphqlResolver.Resolvers = merge(graphqlTodoResolver);

export const appGraphqlRouter = new MZGraphqlRouter({
  apolloServerOptions: {
    typeDefs: graphqlTypeDefs,
    resolvers: graphqlResolvers,
  },
});

export default appGraphqlRouter;
