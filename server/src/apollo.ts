import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { ApolloServer } from '@apollo/server';
import { ApolloContext } from './types/IApolloContext';
import resolvers from './resolvers';
import { GRAPHQL_SCHEMA_PATH } from './constants';

const schema = loadSchemaSync(GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

export async function createApolloServer() {
  return new ApolloServer<ApolloContext>({
    schema: schemaWithResolvers,
  });
}
