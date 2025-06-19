import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { ApolloServer } from '@apollo/server';
import { ApolloContext } from './types';
import resolvers from './resolvers';

const schema = loadSchemaSync('./schema.graphql', { 
  loaders: [new GraphQLFileLoader()] 
});

const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

export async function createApolloServer() {
  return new ApolloServer<ApolloContext>({
    schema: schemaWithResolvers
  });
}
