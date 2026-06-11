import { gql } from '@apollo/client';

export const GET_THREADS_LATEST = gql`
  query GetThreadsLatest($limit: Int, $offset: Int) {
    getThreadsLatest(limit: $limit, offset: $offset) {
      __typename
      ... on ThreadArray {
        totalCount
        threads {
          id
          title
          body
          views
          points
          createdOn
          user { id userName }
          threadCategory { id name }
          threadItems { id }
        }
      }
      ... on EntityResult { messages }
    }
  }
`;

export const GET_THREADS_BY_CATEGORY = gql`
  query GetThreadsByCategory($categoryId: ID!, $limit: Int, $offset: Int) {
    getThreadsByCategoryId(categoryId: $categoryId, limit: $limit, offset: $offset) {
      __typename
      ... on ThreadArray {
        totalCount
        threads {
          id
          title
          body
          views
          points
          createdOn
          user { id userName }
          threadCategory { id name }
          threadItems { id }
        }
      }
      ... on EntityResult { messages }
    }
  }
`;

export const GET_THREAD_BY_ID = gql`
  query GetThreadById($threadId: ID!) {
    getThreadById(threadId: $threadId) {
      __typename
      ... on Thread {
        id
        title
        body
        views
        points
        createdOn
        user { id userName }
        threadCategory { id name }
        threadItems {
          id
          body
          points
          views
          createdOn
          user { id userName }
        }
      }
      ... on EntityResult { messages }
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      threadCategories {
        id
        name
        description
      }
    }
  }
`;

export const GET_TOP_CATEGORY_THREADS = gql`
  query GetTopCategoryThread {
    getTopCategoryThread {
      threadId
      categoryId
      categoryName
      title
      titleCreatedOn
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      __typename
      ... on User {
        id
        userName
        email
        confirmed
      }
      ... on EntityResult { messages }
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query GetUserByUserName($userName: String!) {
    getUserByUserName(userName: $userName) {
      __typename
      ... on User {
        id
        userName
        email
        confirmed
        threads {
          id
          title
          createdOn
          points
          threadItems { id }
          threadCategory { id name }
        }
      }
      ... on EntityResult { messages }
    }
  }
`;
