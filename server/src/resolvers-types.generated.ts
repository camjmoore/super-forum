import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ApolloContext } from './types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type CategoryThread = {
  __typename?: 'CategoryThread';
  categoryId: Scalars['ID']['output'];
  categoryName: Scalars['String']['output'];
  threadId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  titleCreatedOn: Scalars['Date']['output'];
};

export type EntityResult = {
  __typename?: 'EntityResult';
  messages?: Maybe<Array<Scalars['String']['output']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['String']['output'];
  createThread?: Maybe<EntityResult>;
  createThreadItem?: Maybe<EntityResult>;
  login: Scalars['String']['output'];
  logout: Scalars['String']['output'];
  register: Scalars['String']['output'];
  updateThreadItemPoint: Scalars['String']['output'];
  updateThreadPoint: Scalars['String']['output'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
};


export type MutationCreateThreadArgs = {
  body: Scalars['String']['input'];
  categoryId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateThreadItemArgs = {
  body?: InputMaybe<Scalars['String']['input']>;
  threadId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationLogoutArgs = {
  userName: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationUpdateThreadItemPointArgs = {
  increment: Scalars['Boolean']['input'];
  threadItemId: Scalars['ID']['input'];
};


export type MutationUpdateThreadPointArgs = {
  increment: Scalars['Boolean']['input'];
  threadId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAllCategories?: Maybe<Array<ThreadCategory>>;
  getThreadById?: Maybe<ThreadResult>;
  getThreadItemByThreadId: ThreadItemArrayResult;
  getThreadsByCategoryId: ThreadArrayResult;
  getThreadsLatest: ThreadArrayResult;
  getTopCategoryThread?: Maybe<Array<CategoryThread>>;
  me: UserResult;
};


export type QueryGetThreadByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetThreadItemByThreadIdArgs = {
  threadId: Scalars['ID']['input'];
};


export type QueryGetThreadsByCategoryIdArgs = {
  categoryId: Scalars['ID']['input'];
};

export type Thread = {
  __typename?: 'Thread';
  body: Scalars['String']['output'];
  category: ThreadCategory;
  createdBy: Scalars['String']['output'];
  createdOn: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isDisabled: Scalars['Boolean']['output'];
  lastModifiedBy: Scalars['String']['output'];
  lastModifiedOn: Scalars['Date']['output'];
  points: Scalars['Int']['output'];
  threadItems?: Maybe<Array<ThreadItem>>;
  title: Scalars['String']['output'];
  user: User;
  views: Scalars['Int']['output'];
};

export type ThreadArray = {
  __typename?: 'ThreadArray';
  threads?: Maybe<Array<Thread>>;
};

export type ThreadArrayResult = EntityResult | ThreadArray;

export type ThreadCategory = {
  __typename?: 'ThreadCategory';
  createdBy: Scalars['String']['output'];
  createdOn: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastModifiedBy: Scalars['String']['output'];
  lastModifiedOn: Scalars['Date']['output'];
  name: Scalars['String']['output'];
  threads: Array<Thread>;
};

export type ThreadItem = {
  __typename?: 'ThreadItem';
  body: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  createdOn: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isDisabled: Scalars['Boolean']['output'];
  lastModifiedBy: Scalars['String']['output'];
  lastModifiedOn: Scalars['Date']['output'];
  points: Scalars['Int']['output'];
  thread: Thread;
  user: User;
  views: Scalars['Int']['output'];
};

export type ThreadItemArray = {
  __typename?: 'ThreadItemArray';
  threadItems?: Maybe<Array<ThreadItem>>;
};

export type ThreadItemArrayResult = EntityResult | ThreadItemArray;

export type ThreadItemPoint = {
  __typename?: 'ThreadItemPoint';
  createdBy: Scalars['String']['output'];
  createdOn: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isDecrement: Scalars['Boolean']['output'];
  lastModifiedBy: Scalars['String']['output'];
  lastModifiedOn: Scalars['Date']['output'];
  threadItem: ThreadItem;
  user: User;
};

export type ThreadItemResult = EntityResult | ThreadItem;

export type ThreadPoint = {
  __typename?: 'ThreadPoint';
  createdBy: Scalars['String']['output'];
  createdOn: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isDecrement: Scalars['Boolean']['output'];
  lastModifiedBy: Scalars['String']['output'];
  lastModifiedOn: Scalars['Date']['output'];
  thread: Thread;
  user: User;
};

export type ThreadResult = EntityResult | Thread;

export type User = {
  __typename?: 'User';
  confirmed: Scalars['Boolean']['output'];
  createdBy: Scalars['String']['output'];
  createdOn: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDisabled: Scalars['Boolean']['output'];
  lastModifiedBy: Scalars['String']['output'];
  lastModifiedOn: Scalars['Date']['output'];
  password: Scalars['String']['output'];
  threadItems?: Maybe<Array<ThreadItem>>;
  threads?: Maybe<Array<Thread>>;
  userName: Scalars['String']['output'];
};

export type UserResult = EntityResult | User;

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  ThreadArrayResult: ( EntityResult ) | ( ThreadArray );
  ThreadItemArrayResult: ( EntityResult ) | ( ThreadItemArray );
  ThreadItemResult: ( EntityResult ) | ( ThreadItem );
  ThreadResult: ( EntityResult ) | ( Thread );
  UserResult: ( EntityResult ) | ( User );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CategoryThread: ResolverTypeWrapper<CategoryThread>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  EntityResult: ResolverTypeWrapper<EntityResult>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Thread: ResolverTypeWrapper<Thread>;
  ThreadArray: ResolverTypeWrapper<ThreadArray>;
  ThreadArrayResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ThreadArrayResult']>;
  ThreadCategory: ResolverTypeWrapper<ThreadCategory>;
  ThreadItem: ResolverTypeWrapper<ThreadItem>;
  ThreadItemArray: ResolverTypeWrapper<ThreadItemArray>;
  ThreadItemArrayResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ThreadItemArrayResult']>;
  ThreadItemPoint: ResolverTypeWrapper<ThreadItemPoint>;
  ThreadItemResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ThreadItemResult']>;
  ThreadPoint: ResolverTypeWrapper<ThreadPoint>;
  ThreadResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ThreadResult']>;
  User: ResolverTypeWrapper<User>;
  UserResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UserResult']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CategoryThread: CategoryThread;
  Date: Scalars['Date']['output'];
  EntityResult: EntityResult;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Thread: Thread;
  ThreadArray: ThreadArray;
  ThreadArrayResult: ResolversUnionTypes<ResolversParentTypes>['ThreadArrayResult'];
  ThreadCategory: ThreadCategory;
  ThreadItem: ThreadItem;
  ThreadItemArray: ThreadItemArray;
  ThreadItemArrayResult: ResolversUnionTypes<ResolversParentTypes>['ThreadItemArrayResult'];
  ThreadItemPoint: ThreadItemPoint;
  ThreadItemResult: ResolversUnionTypes<ResolversParentTypes>['ThreadItemResult'];
  ThreadPoint: ThreadPoint;
  ThreadResult: ResolversUnionTypes<ResolversParentTypes>['ThreadResult'];
  User: User;
  UserResult: ResolversUnionTypes<ResolversParentTypes>['UserResult'];
}>;

export type CategoryThreadResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['CategoryThread'] = ResolversParentTypes['CategoryThread']> = ResolversObject<{
  categoryId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  categoryName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  threadId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  titleCreatedOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EntityResultResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['EntityResult'] = ResolversParentTypes['EntityResult']> = ResolversObject<{
  messages?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  changePassword?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword'>>;
  createThread?: Resolver<Maybe<ResolversTypes['EntityResult']>, ParentType, ContextType, RequireFields<MutationCreateThreadArgs, 'body' | 'categoryId' | 'title' | 'userId'>>;
  createThreadItem?: Resolver<Maybe<ResolversTypes['EntityResult']>, ParentType, ContextType, RequireFields<MutationCreateThreadItemArgs, 'threadId' | 'userId'>>;
  login?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'userName'>>;
  logout?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLogoutArgs, 'userName'>>;
  register?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'email' | 'password' | 'userName'>>;
  updateThreadItemPoint?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationUpdateThreadItemPointArgs, 'increment' | 'threadItemId'>>;
  updateThreadPoint?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationUpdateThreadPointArgs, 'increment' | 'threadId'>>;
}>;

export type QueryResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getAllCategories?: Resolver<Maybe<Array<ResolversTypes['ThreadCategory']>>, ParentType, ContextType>;
  getThreadById?: Resolver<Maybe<ResolversTypes['ThreadResult']>, ParentType, ContextType, RequireFields<QueryGetThreadByIdArgs, 'id'>>;
  getThreadItemByThreadId?: Resolver<ResolversTypes['ThreadItemArrayResult'], ParentType, ContextType, RequireFields<QueryGetThreadItemByThreadIdArgs, 'threadId'>>;
  getThreadsByCategoryId?: Resolver<ResolversTypes['ThreadArrayResult'], ParentType, ContextType, RequireFields<QueryGetThreadsByCategoryIdArgs, 'categoryId'>>;
  getThreadsLatest?: Resolver<ResolversTypes['ThreadArrayResult'], ParentType, ContextType>;
  getTopCategoryThread?: Resolver<Maybe<Array<ResolversTypes['CategoryThread']>>, ParentType, ContextType>;
  me?: Resolver<ResolversTypes['UserResult'], ParentType, ContextType>;
}>;

export type ThreadResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Thread'] = ResolversParentTypes['Thread']> = ResolversObject<{
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['ThreadCategory'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDisabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastModifiedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModifiedOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  threadItems?: Resolver<Maybe<Array<ResolversTypes['ThreadItem']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ThreadArrayResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadArray'] = ResolversParentTypes['ThreadArray']> = ResolversObject<{
  threads?: Resolver<Maybe<Array<ResolversTypes['Thread']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ThreadArrayResultResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadArrayResult'] = ResolversParentTypes['ThreadArrayResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EntityResult' | 'ThreadArray', ParentType, ContextType>;
}>;

export type ThreadCategoryResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadCategory'] = ResolversParentTypes['ThreadCategory']> = ResolversObject<{
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastModifiedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModifiedOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  threads?: Resolver<Array<ResolversTypes['Thread']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ThreadItemResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadItem'] = ResolversParentTypes['ThreadItem']> = ResolversObject<{
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDisabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastModifiedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModifiedOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ThreadItemArrayResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadItemArray'] = ResolversParentTypes['ThreadItemArray']> = ResolversObject<{
  threadItems?: Resolver<Maybe<Array<ResolversTypes['ThreadItem']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ThreadItemArrayResultResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadItemArrayResult'] = ResolversParentTypes['ThreadItemArrayResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EntityResult' | 'ThreadItemArray', ParentType, ContextType>;
}>;

export type ThreadItemPointResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadItemPoint'] = ResolversParentTypes['ThreadItemPoint']> = ResolversObject<{
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDecrement?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastModifiedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModifiedOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  threadItem?: Resolver<ResolversTypes['ThreadItem'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ThreadItemResultResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadItemResult'] = ResolversParentTypes['ThreadItemResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EntityResult' | 'ThreadItem', ParentType, ContextType>;
}>;

export type ThreadPointResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadPoint'] = ResolversParentTypes['ThreadPoint']> = ResolversObject<{
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDecrement?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastModifiedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModifiedOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ThreadResultResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['ThreadResult'] = ResolversParentTypes['ThreadResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EntityResult' | 'Thread', ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  confirmed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDisabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastModifiedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModifiedOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  threadItems?: Resolver<Maybe<Array<ResolversTypes['ThreadItem']>>, ParentType, ContextType>;
  threads?: Resolver<Maybe<Array<ResolversTypes['Thread']>>, ParentType, ContextType>;
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResultResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['UserResult'] = ResolversParentTypes['UserResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EntityResult' | 'User', ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ApolloContext> = ResolversObject<{
  CategoryThread?: CategoryThreadResolvers<ContextType>;
  Date?: GraphQLScalarType;
  EntityResult?: EntityResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Thread?: ThreadResolvers<ContextType>;
  ThreadArray?: ThreadArrayResolvers<ContextType>;
  ThreadArrayResult?: ThreadArrayResultResolvers<ContextType>;
  ThreadCategory?: ThreadCategoryResolvers<ContextType>;
  ThreadItem?: ThreadItemResolvers<ContextType>;
  ThreadItemArray?: ThreadItemArrayResolvers<ContextType>;
  ThreadItemArrayResult?: ThreadItemArrayResultResolvers<ContextType>;
  ThreadItemPoint?: ThreadItemPointResolvers<ContextType>;
  ThreadItemResult?: ThreadItemResultResolvers<ContextType>;
  ThreadPoint?: ThreadPointResolvers<ContextType>;
  ThreadResult?: ThreadResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserResult?: UserResultResolvers<ContextType>;
}>;

