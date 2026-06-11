import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($email: String!, $userName: String!, $password: String!) {
    register(email: $email, userName: $userName, password: $password) {
      __typename
      ... on User { id userName email }
      ... on EntityResult { messages }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password)
  }
`;

export const LOGOUT = gql`
  mutation Logout($userName: String!) {
    logout(userName: $userName)
  }
`;

export const CREATE_THREAD = gql`
  mutation CreateThread($categoryId: ID!, $title: String!, $body: String!) {
    createThread(categoryId: $categoryId, title: $title, body: $body) {
      __typename
      ... on EntityResult { messages }
    }
  }
`;

export const CREATE_THREAD_ITEM = gql`
  mutation CreateThreadItem($threadId: ID!, $body: String) {
    createThreadItem(threadId: $threadId, body: $body) {
      __typename
      ... on EntityResult { messages }
    }
  }
`;

export const UPDATE_THREAD_POINT = gql`
  mutation UpdateThreadPoint($threadId: ID!, $increment: Boolean!) {
    updateThreadPoint(threadId: $threadId, increment: $increment)
  }
`;

export const UPDATE_THREAD_ITEM_POINT = gql`
  mutation UpdateThreadItemPoint($threadItemId: ID!, $increment: Boolean!) {
    updateThreadItemPoint(threadItemId: $threadItemId, increment: $increment)
  }
`;

export const CONFIRM_USER = gql`
  mutation ConfirmUser($token: String!) {
    confirmUser(token: $token)
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword)
  }
`;
