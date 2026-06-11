import { ApolloServer } from '@apollo/server';
import { createApolloServer } from '../../apollo';
import { ApolloContext } from '../../types/IApolloContext';
import { Repositories } from '../../types/repository-types';

// Minimal mock context — only the fields resolvers actually touch
const makeContext = (userId?: string): ApolloContext =>
  ({
    req: { session: { userId: userId ?? null } },
    res: {},
    dataSource: {},
    redis: {},
    repository: mockRepo,
  }) as unknown as ApolloContext;

// Full mock repository — each test overrides individual functions as needed
const mockRepo: Repositories = {
  createThread: jest.fn(),
  getThreadById: jest.fn(),
  getThreadsByCategoryId: jest.fn(),
  getThreadsLatest: jest.fn(),
  getUserThreads: jest.fn(),
  getTopCategoryThreads: jest.fn(),
  createThreadItem: jest.fn(),
  getThreadItemById: jest.fn(),
  getThreadItemByThreadId: jest.fn(),
  getThreadItemsByThreadId: jest.fn(),
  getUserThreadItems: jest.fn(),
  getAllCategories: jest.fn(),
  getCategoryById: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  getUserById: jest.fn(),
  getUserByUserName: jest.fn(),
  confirmUser: jest.fn(),
  changePassword: jest.fn(),
  updateThreadPoint: jest.fn(),
  updateThreadItemPoint: jest.fn(),
};

let server: ApolloServer<ApolloContext>;

beforeAll(async () => {
  server = await createApolloServer();
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── register ────────────────────────────────────────────────────────────────

describe('Mutation.register', () => {
  const REGISTER = `
    mutation Register($email: String!, $userName: String!, $password: String!) {
      register(email: $email, userName: $userName, password: $password) {
        __typename
        ... on User { id email userName confirmed }
        ... on EntityResult { messages }
      }
    }
  `;

  it('returns User on success', async () => {
    (mockRepo.register as jest.Mock).mockResolvedValue({
      user: {
        id: '1',
        email: 'a@b.com',
        userName: 'alice',
        password: '',
        confirmed: false,
        isDisabled: false,
        createdBy: 'alice',
        createdOn: new Date(),
        lastModifiedBy: 'alice',
        lastModifiedOn: new Date(),
      },
    });

    const res = await server.executeOperation(
      {
        query: REGISTER,
        variables: { email: 'a@b.com', userName: 'alice', password: 'Pass1!' },
      },
      { contextValue: makeContext() }
    );

    expect(res.body.kind).toBe('single');
    const data = (res.body as any).singleResult.data?.register;
    expect(data.__typename).toBe('User');
    expect(data.email).toBe('a@b.com');
  });

  it('returns EntityResult on validation failure', async () => {
    (mockRepo.register as jest.Mock).mockResolvedValue({
      messages: ['passwords must have min length of 8, 1 upper case character, 1 number and 1 symbol'],
    });

    const res = await server.executeOperation(
      {
        query: REGISTER,
        variables: { email: 'a@b.com', userName: 'alice', password: 'weak' },
      },
      { contextValue: makeContext() }
    );

    const data = (res.body as any).singleResult.data?.register;
    expect(data.__typename).toBe('EntityResult');
    expect(data.messages[0]).toMatch(/passwords must have/);
  });
});

// ─── login ───────────────────────────────────────────────────────────────────

describe('Mutation.login', () => {
  const LOGIN = `
    mutation Login($userName: String!, $password: String!) {
      login(userName: $userName, password: $password)
    }
  `;

  it('returns success message on valid credentials', async () => {
    (mockRepo.login as jest.Mock).mockResolvedValue({
      user: { id: '1', userName: 'alice' },
    });

    const res = await server.executeOperation(
      { query: LOGIN, variables: { userName: 'alice', password: 'Pass1!' } },
      { contextValue: makeContext() }
    );

    expect((res.body as any).singleResult.data?.login).toMatch(/logged in/);
  });

  it('returns error message on invalid credentials', async () => {
    (mockRepo.login as jest.Mock).mockResolvedValue({
      messages: ['Password is invalid.'],
    });

    const res = await server.executeOperation(
      { query: LOGIN, variables: { userName: 'alice', password: 'wrong' } },
      { contextValue: makeContext() }
    );

    expect((res.body as any).singleResult.data?.login).toBe('Password is invalid.');
  });

  it('rejects unconfirmed user', async () => {
    (mockRepo.login as jest.Mock).mockResolvedValue({
      messages: ['User has not confirmed their registration email yet.'],
    });

    const res = await server.executeOperation(
      { query: LOGIN, variables: { userName: 'alice', password: 'Pass1!' } },
      { contextValue: makeContext() }
    );

    expect((res.body as any).singleResult.data?.login).toMatch(/confirmed/);
  });
});

// ─── createThread ─────────────────────────────────────────────────────────────

describe('Mutation.createThread', () => {
  const CREATE_THREAD = `
    mutation CreateThread($categoryId: ID!, $title: String!, $body: String!) {
      createThread(categoryId: $categoryId, title: $title, body: $body) {
        __typename
        ... on EntityResult { messages }
      }
    }
  `;

  it('rejects unauthenticated caller', async () => {
    const res = await server.executeOperation(
      {
        query: CREATE_THREAD,
        variables: { categoryId: '1', title: 'Test', body: 'Hello' },
      },
      { contextValue: makeContext() }
    );

    const data = (res.body as any).singleResult.data?.createThread;
    expect(data.__typename).toBe('EntityResult');
    expect(data.messages[0]).toMatch(/logged in/);
    expect(mockRepo.createThread).not.toHaveBeenCalled();
  });

  it('calls createThread for authenticated user', async () => {
    (mockRepo.createThread as jest.Mock).mockResolvedValue({
      messages: ['Thread created successfully.'],
    });

    const res = await server.executeOperation(
      {
        query: CREATE_THREAD,
        variables: { categoryId: '1', title: 'Test', body: 'Hello' },
      },
      { contextValue: makeContext('user-1') }
    );

    expect(mockRepo.createThread).toHaveBeenCalledWith('user-1', '1', 'Test', 'Hello');
    const data = (res.body as any).singleResult.data?.createThread;
    expect(data.messages[0]).toMatch(/created successfully/);
  });
});

// ─── getThreadsByCategoryId ───────────────────────────────────────────────────

describe('Query.getThreadsByCategoryId', () => {
  const GET_BY_CATEGORY = `
    query GetThreads($categoryId: ID!) {
      getThreadsByCategoryId(categoryId: $categoryId) {
        __typename
        ... on ThreadArray { threads { id title } }
        ... on EntityResult { messages }
      }
    }
  `;

  const fakeThread = {
    id: '1',
    title: 'Hello',
    body: 'World',
    views: 0,
    points: 0,
    isDisabled: false,
    createdBy: 'alice',
    createdOn: new Date(),
    lastModifiedBy: 'alice',
    lastModifiedOn: new Date(),
    user: { id: 'u1' },
    threadCategory: { id: 'c1' },
    threadItems: [],
  };

  it('returns ThreadArray when threads exist', async () => {
    (mockRepo.getThreadsByCategoryId as jest.Mock).mockResolvedValue({
      entities: [fakeThread],
    });

    const res = await server.executeOperation(
      { query: GET_BY_CATEGORY, variables: { categoryId: 'c1' } },
      { contextValue: makeContext() }
    );

    const data = (res.body as any).singleResult.data?.getThreadsByCategoryId;
    expect(data.__typename).toBe('ThreadArray');
    expect(data.threads).toHaveLength(1);
    expect(data.threads[0].title).toBe('Hello');
  });

  it('calls repository with the given categoryId', async () => {
    (mockRepo.getThreadsByCategoryId as jest.Mock).mockResolvedValue({
      entities: [fakeThread],
    });

    await server.executeOperation(
      { query: GET_BY_CATEGORY, variables: { categoryId: 'c1' } },
      { contextValue: makeContext() }
    );

    expect(mockRepo.getThreadsByCategoryId).toHaveBeenCalledWith('c1', 10, 0);
  });

  it('returns EntityResult when no threads found', async () => {
    (mockRepo.getThreadsByCategoryId as jest.Mock).mockResolvedValue({
      messages: ['threads of category not found.'],
    });

    const res = await server.executeOperation(
      { query: GET_BY_CATEGORY, variables: { categoryId: 'c1' } },
      { contextValue: makeContext() }
    );

    const data = (res.body as any).singleResult.data?.getThreadsByCategoryId;
    expect(data.__typename).toBe('EntityResult');
  });
});

// ─── confirmUser ─────────────────────────────────────────────────────────────

describe('Mutation.confirmUser', () => {
  const CONFIRM = `
    mutation ConfirmUser($token: String!) {
      confirmUser(token: $token)
    }
  `;

  it('returns success message on valid token', async () => {
    (mockRepo.confirmUser as jest.Mock).mockResolvedValue('User confirmed successfully.');

    const res = await server.executeOperation(
      { query: CONFIRM, variables: { token: 'valid-token' } },
      { contextValue: makeContext() }
    );

    expect((res.body as any).singleResult.data?.confirmUser).toBe('User confirmed successfully.');
  });

  it('returns error message on invalid token', async () => {
    (mockRepo.confirmUser as jest.Mock).mockResolvedValue('Invalid or expired confirmation token.');

    const res = await server.executeOperation(
      { query: CONFIRM, variables: { token: 'bad-token' } },
      { contextValue: makeContext() }
    );

    expect((res.body as any).singleResult.data?.confirmUser).toMatch(/Invalid or expired/);
  });
});

// ─── getUserByUserName ───────────────────────────────────────────────────────

describe('Query.getUserByUserName', () => {
  const GET_USER = `
    query GetUser($userName: String!) {
      getUserByUserName(userName: $userName) {
        __typename
        ... on User { id userName email }
        ... on EntityResult { messages }
      }
    }
  `;

  it('returns User when found', async () => {
    (mockRepo.getUserByUserName as jest.Mock).mockResolvedValue({
      user: {
        id: '1',
        userName: 'alice',
        email: 'a@b.com',
        password: '',
        confirmed: true,
        isDisabled: false,
        createdBy: 'alice',
        createdOn: new Date(),
        lastModifiedBy: 'alice',
        lastModifiedOn: new Date(),
      },
    });

    const res = await server.executeOperation(
      { query: GET_USER, variables: { userName: 'alice' } },
      { contextValue: makeContext() }
    );

    const data = (res.body as any).singleResult.data?.getUserByUserName;
    expect(data.__typename).toBe('User');
    expect(data.userName).toBe('alice');
  });

  it('returns EntityResult when not found', async () => {
    (mockRepo.getUserByUserName as jest.Mock).mockResolvedValue({
      messages: ['User with userName nobody not found'],
    });

    const res = await server.executeOperation(
      { query: GET_USER, variables: { userName: 'nobody' } },
      { contextValue: makeContext() }
    );

    const data = (res.body as any).singleResult.data?.getUserByUserName;
    expect(data.__typename).toBe('EntityResult');
  });
});
