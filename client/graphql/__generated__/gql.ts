/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Register($email: String!, $userName: String!, $password: String!) {\n    register(email: $email, userName: $userName, password: $password) {\n      __typename\n      ... on User { id userName email }\n      ... on EntityResult { messages }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation Login($userName: String!, $password: String!) {\n    login(userName: $userName, password: $password)\n  }\n": typeof types.LoginDocument,
    "\n  mutation Logout($userName: String!) {\n    logout(userName: $userName)\n  }\n": typeof types.LogoutDocument,
    "\n  mutation CreateThread($categoryId: ID!, $title: String!, $body: String!) {\n    createThread(categoryId: $categoryId, title: $title, body: $body) {\n      __typename\n      ... on EntityResult { messages }\n    }\n  }\n": typeof types.CreateThreadDocument,
    "\n  mutation CreateThreadItem($threadId: ID!, $body: String) {\n    createThreadItem(threadId: $threadId, body: $body) {\n      __typename\n      ... on EntityResult { messages }\n    }\n  }\n": typeof types.CreateThreadItemDocument,
    "\n  mutation UpdateThreadPoint($threadId: ID!, $increment: Boolean!) {\n    updateThreadPoint(threadId: $threadId, increment: $increment)\n  }\n": typeof types.UpdateThreadPointDocument,
    "\n  mutation UpdateThreadItemPoint($threadItemId: ID!, $increment: Boolean!) {\n    updateThreadItemPoint(threadItemId: $threadItemId, increment: $increment)\n  }\n": typeof types.UpdateThreadItemPointDocument,
    "\n  mutation ConfirmUser($token: String!) {\n    confirmUser(token: $token)\n  }\n": typeof types.ConfirmUserDocument,
    "\n  mutation ChangePassword($newPassword: String!) {\n    changePassword(newPassword: $newPassword)\n  }\n": typeof types.ChangePasswordDocument,
    "\n  query GetThreadsLatest($limit: Int, $offset: Int) {\n    getThreadsLatest(limit: $limit, offset: $offset) {\n      __typename\n      ... on ThreadArray {\n        totalCount\n        threads {\n          id\n          title\n          body\n          views\n          points\n          createdOn\n          user { id userName }\n          threadCategory { id name }\n          threadItems { id }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": typeof types.GetThreadsLatestDocument,
    "\n  query GetThreadsByCategory($categoryId: ID!, $limit: Int, $offset: Int) {\n    getThreadsByCategoryId(categoryId: $categoryId, limit: $limit, offset: $offset) {\n      __typename\n      ... on ThreadArray {\n        totalCount\n        threads {\n          id\n          title\n          body\n          views\n          points\n          createdOn\n          user { id userName }\n          threadCategory { id name }\n          threadItems { id }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": typeof types.GetThreadsByCategoryDocument,
    "\n  query GetThreadById($threadId: ID!) {\n    getThreadById(threadId: $threadId) {\n      __typename\n      ... on Thread {\n        id\n        title\n        body\n        views\n        points\n        createdOn\n        user { id userName }\n        threadCategory { id name }\n        threadItems {\n          id\n          body\n          points\n          views\n          createdOn\n          user { id userName }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": typeof types.GetThreadByIdDocument,
    "\n  query GetAllCategories {\n    getAllCategories {\n      threadCategories {\n        id\n        name\n        description\n      }\n    }\n  }\n": typeof types.GetAllCategoriesDocument,
    "\n  query GetTopCategoryThread {\n    getTopCategoryThread {\n      threadId\n      categoryId\n      categoryName\n      title\n      titleCreatedOn\n    }\n  }\n": typeof types.GetTopCategoryThreadDocument,
    "\n  query Me {\n    me {\n      __typename\n      ... on User {\n        id\n        userName\n        email\n        confirmed\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": typeof types.MeDocument,
    "\n  query GetUserByUserName($userName: String!) {\n    getUserByUserName(userName: $userName) {\n      __typename\n      ... on User {\n        id\n        userName\n        email\n        confirmed\n        threads {\n          id\n          title\n          createdOn\n          points\n          threadItems { id }\n          threadCategory { id name }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": typeof types.GetUserByUserNameDocument,
};
const documents: Documents = {
    "\n  mutation Register($email: String!, $userName: String!, $password: String!) {\n    register(email: $email, userName: $userName, password: $password) {\n      __typename\n      ... on User { id userName email }\n      ... on EntityResult { messages }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation Login($userName: String!, $password: String!) {\n    login(userName: $userName, password: $password)\n  }\n": types.LoginDocument,
    "\n  mutation Logout($userName: String!) {\n    logout(userName: $userName)\n  }\n": types.LogoutDocument,
    "\n  mutation CreateThread($categoryId: ID!, $title: String!, $body: String!) {\n    createThread(categoryId: $categoryId, title: $title, body: $body) {\n      __typename\n      ... on EntityResult { messages }\n    }\n  }\n": types.CreateThreadDocument,
    "\n  mutation CreateThreadItem($threadId: ID!, $body: String) {\n    createThreadItem(threadId: $threadId, body: $body) {\n      __typename\n      ... on EntityResult { messages }\n    }\n  }\n": types.CreateThreadItemDocument,
    "\n  mutation UpdateThreadPoint($threadId: ID!, $increment: Boolean!) {\n    updateThreadPoint(threadId: $threadId, increment: $increment)\n  }\n": types.UpdateThreadPointDocument,
    "\n  mutation UpdateThreadItemPoint($threadItemId: ID!, $increment: Boolean!) {\n    updateThreadItemPoint(threadItemId: $threadItemId, increment: $increment)\n  }\n": types.UpdateThreadItemPointDocument,
    "\n  mutation ConfirmUser($token: String!) {\n    confirmUser(token: $token)\n  }\n": types.ConfirmUserDocument,
    "\n  mutation ChangePassword($newPassword: String!) {\n    changePassword(newPassword: $newPassword)\n  }\n": types.ChangePasswordDocument,
    "\n  query GetThreadsLatest($limit: Int, $offset: Int) {\n    getThreadsLatest(limit: $limit, offset: $offset) {\n      __typename\n      ... on ThreadArray {\n        totalCount\n        threads {\n          id\n          title\n          body\n          views\n          points\n          createdOn\n          user { id userName }\n          threadCategory { id name }\n          threadItems { id }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": types.GetThreadsLatestDocument,
    "\n  query GetThreadsByCategory($categoryId: ID!, $limit: Int, $offset: Int) {\n    getThreadsByCategoryId(categoryId: $categoryId, limit: $limit, offset: $offset) {\n      __typename\n      ... on ThreadArray {\n        totalCount\n        threads {\n          id\n          title\n          body\n          views\n          points\n          createdOn\n          user { id userName }\n          threadCategory { id name }\n          threadItems { id }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": types.GetThreadsByCategoryDocument,
    "\n  query GetThreadById($threadId: ID!) {\n    getThreadById(threadId: $threadId) {\n      __typename\n      ... on Thread {\n        id\n        title\n        body\n        views\n        points\n        createdOn\n        user { id userName }\n        threadCategory { id name }\n        threadItems {\n          id\n          body\n          points\n          views\n          createdOn\n          user { id userName }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": types.GetThreadByIdDocument,
    "\n  query GetAllCategories {\n    getAllCategories {\n      threadCategories {\n        id\n        name\n        description\n      }\n    }\n  }\n": types.GetAllCategoriesDocument,
    "\n  query GetTopCategoryThread {\n    getTopCategoryThread {\n      threadId\n      categoryId\n      categoryName\n      title\n      titleCreatedOn\n    }\n  }\n": types.GetTopCategoryThreadDocument,
    "\n  query Me {\n    me {\n      __typename\n      ... on User {\n        id\n        userName\n        email\n        confirmed\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": types.MeDocument,
    "\n  query GetUserByUserName($userName: String!) {\n    getUserByUserName(userName: $userName) {\n      __typename\n      ... on User {\n        id\n        userName\n        email\n        confirmed\n        threads {\n          id\n          title\n          createdOn\n          points\n          threadItems { id }\n          threadCategory { id name }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n": types.GetUserByUserNameDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Register($email: String!, $userName: String!, $password: String!) {\n    register(email: $email, userName: $userName, password: $password) {\n      __typename\n      ... on User { id userName email }\n      ... on EntityResult { messages }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($email: String!, $userName: String!, $password: String!) {\n    register(email: $email, userName: $userName, password: $password) {\n      __typename\n      ... on User { id userName email }\n      ... on EntityResult { messages }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($userName: String!, $password: String!) {\n    login(userName: $userName, password: $password)\n  }\n"): (typeof documents)["\n  mutation Login($userName: String!, $password: String!) {\n    login(userName: $userName, password: $password)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Logout($userName: String!) {\n    logout(userName: $userName)\n  }\n"): (typeof documents)["\n  mutation Logout($userName: String!) {\n    logout(userName: $userName)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateThread($categoryId: ID!, $title: String!, $body: String!) {\n    createThread(categoryId: $categoryId, title: $title, body: $body) {\n      __typename\n      ... on EntityResult { messages }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateThread($categoryId: ID!, $title: String!, $body: String!) {\n    createThread(categoryId: $categoryId, title: $title, body: $body) {\n      __typename\n      ... on EntityResult { messages }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateThreadItem($threadId: ID!, $body: String) {\n    createThreadItem(threadId: $threadId, body: $body) {\n      __typename\n      ... on EntityResult { messages }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateThreadItem($threadId: ID!, $body: String) {\n    createThreadItem(threadId: $threadId, body: $body) {\n      __typename\n      ... on EntityResult { messages }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateThreadPoint($threadId: ID!, $increment: Boolean!) {\n    updateThreadPoint(threadId: $threadId, increment: $increment)\n  }\n"): (typeof documents)["\n  mutation UpdateThreadPoint($threadId: ID!, $increment: Boolean!) {\n    updateThreadPoint(threadId: $threadId, increment: $increment)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateThreadItemPoint($threadItemId: ID!, $increment: Boolean!) {\n    updateThreadItemPoint(threadItemId: $threadItemId, increment: $increment)\n  }\n"): (typeof documents)["\n  mutation UpdateThreadItemPoint($threadItemId: ID!, $increment: Boolean!) {\n    updateThreadItemPoint(threadItemId: $threadItemId, increment: $increment)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ConfirmUser($token: String!) {\n    confirmUser(token: $token)\n  }\n"): (typeof documents)["\n  mutation ConfirmUser($token: String!) {\n    confirmUser(token: $token)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ChangePassword($newPassword: String!) {\n    changePassword(newPassword: $newPassword)\n  }\n"): (typeof documents)["\n  mutation ChangePassword($newPassword: String!) {\n    changePassword(newPassword: $newPassword)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetThreadsLatest($limit: Int, $offset: Int) {\n    getThreadsLatest(limit: $limit, offset: $offset) {\n      __typename\n      ... on ThreadArray {\n        totalCount\n        threads {\n          id\n          title\n          body\n          views\n          points\n          createdOn\n          user { id userName }\n          threadCategory { id name }\n          threadItems { id }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"): (typeof documents)["\n  query GetThreadsLatest($limit: Int, $offset: Int) {\n    getThreadsLatest(limit: $limit, offset: $offset) {\n      __typename\n      ... on ThreadArray {\n        totalCount\n        threads {\n          id\n          title\n          body\n          views\n          points\n          createdOn\n          user { id userName }\n          threadCategory { id name }\n          threadItems { id }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetThreadsByCategory($categoryId: ID!, $limit: Int, $offset: Int) {\n    getThreadsByCategoryId(categoryId: $categoryId, limit: $limit, offset: $offset) {\n      __typename\n      ... on ThreadArray {\n        totalCount\n        threads {\n          id\n          title\n          body\n          views\n          points\n          createdOn\n          user { id userName }\n          threadCategory { id name }\n          threadItems { id }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"): (typeof documents)["\n  query GetThreadsByCategory($categoryId: ID!, $limit: Int, $offset: Int) {\n    getThreadsByCategoryId(categoryId: $categoryId, limit: $limit, offset: $offset) {\n      __typename\n      ... on ThreadArray {\n        totalCount\n        threads {\n          id\n          title\n          body\n          views\n          points\n          createdOn\n          user { id userName }\n          threadCategory { id name }\n          threadItems { id }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetThreadById($threadId: ID!) {\n    getThreadById(threadId: $threadId) {\n      __typename\n      ... on Thread {\n        id\n        title\n        body\n        views\n        points\n        createdOn\n        user { id userName }\n        threadCategory { id name }\n        threadItems {\n          id\n          body\n          points\n          views\n          createdOn\n          user { id userName }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"): (typeof documents)["\n  query GetThreadById($threadId: ID!) {\n    getThreadById(threadId: $threadId) {\n      __typename\n      ... on Thread {\n        id\n        title\n        body\n        views\n        points\n        createdOn\n        user { id userName }\n        threadCategory { id name }\n        threadItems {\n          id\n          body\n          points\n          views\n          createdOn\n          user { id userName }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAllCategories {\n    getAllCategories {\n      threadCategories {\n        id\n        name\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllCategories {\n    getAllCategories {\n      threadCategories {\n        id\n        name\n        description\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTopCategoryThread {\n    getTopCategoryThread {\n      threadId\n      categoryId\n      categoryName\n      title\n      titleCreatedOn\n    }\n  }\n"): (typeof documents)["\n  query GetTopCategoryThread {\n    getTopCategoryThread {\n      threadId\n      categoryId\n      categoryName\n      title\n      titleCreatedOn\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Me {\n    me {\n      __typename\n      ... on User {\n        id\n        userName\n        email\n        confirmed\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      __typename\n      ... on User {\n        id\n        userName\n        email\n        confirmed\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserByUserName($userName: String!) {\n    getUserByUserName(userName: $userName) {\n      __typename\n      ... on User {\n        id\n        userName\n        email\n        confirmed\n        threads {\n          id\n          title\n          createdOn\n          points\n          threadItems { id }\n          threadCategory { id name }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"): (typeof documents)["\n  query GetUserByUserName($userName: String!) {\n    getUserByUserName(userName: $userName) {\n      __typename\n      ... on User {\n        id\n        userName\n        email\n        confirmed\n        threads {\n          id\n          title\n          createdOn\n          points\n          threadItems { id }\n          threadCategory { id name }\n        }\n      }\n      ... on EntityResult { messages }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;