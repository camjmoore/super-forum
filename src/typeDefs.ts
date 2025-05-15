import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar Date
  type EntityResult {
    messages: [String!]
  }
  type User {
  id: ID!
  email: String!
  userName: String!
  password: String!
  confirmed: Boolean!
  isDisabled: Boolean!
  threads: [Thread!]
}
`

