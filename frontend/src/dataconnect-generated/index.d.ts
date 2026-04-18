import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ApiKey_Key {
  id: UUIDString;
  __typename?: 'ApiKey_Key';
}

export interface CodeChange_Key {
  id: UUIDString;
  __typename?: 'CodeChange_Key';
}

export interface CodeEditorActivity_Key {
  id: UUIDString;
  __typename?: 'CodeEditorActivity_Key';
}

export interface CodeRequest_Key {
  id: UUIDString;
  __typename?: 'CodeRequest_Key';
}

export interface CreateCodeRequestData {
  codeRequest_insert: CodeRequest_Key;
}

export interface CreateCodeRequestVariables {
  projectId?: UUIDString | null;
  rawRequest: string;
  urgency?: string | null;
  areaOfApp?: string | null;
}

export interface CreateKnowledgeBaseData {
  knowledgeBase_insert: KnowledgeBase_Key;
}

export interface CreateKnowledgeBaseVariables {
  projectId?: UUIDString | null;
  title: string;
  category: string;
  description: string;
  priority: number;
  language?: string | null;
  framework?: string | null;
  codeExample?: string | null;
  badExample?: string | null;
}

export interface CreateProjectData {
  project_insert: Project_Key;
}

export interface CreateProjectVariables {
  name: string;
  description?: string | null;
  domain?: string | null;
  repositoryUrl?: string | null;
  techStack?: string[] | null;
}

export interface CreateWorkspaceData {
  workspace_insert: Workspace_Key;
}

export interface CreateWorkspaceVariables {
  name: string;
  path: string;
  description?: string | null;
  isGitRepo: boolean;
}

export interface DeleteKnowledgeBaseData {
  knowledgeBase_deleteMany: number;
}

export interface DeleteKnowledgeBaseVariables {
  id: UUIDString;
}

export interface DeleteProjectData {
  project_deleteMany: number;
}

export interface DeleteProjectVariables {
  id: UUIDString;
}

export interface DeleteWorkspaceData {
  workspace_deleteMany: number;
}

export interface DeleteWorkspaceVariables {
  id: UUIDString;
}

export interface GeneratedCode_Key {
  id: UUIDString;
  __typename?: 'GeneratedCode_Key';
}

export interface GeneratedMedia_Key {
  id: UUIDString;
  __typename?: 'GeneratedMedia_Key';
}

export interface GetCurrentUserData {
  user?: {
    id: string;
    username: string;
    email: string;
    displayName?: string | null;
    profilePictureUrl?: string | null;
    plan: string;
    role: string;
    aiModel?: string | null;
    maxTokens?: number | null;
    usageInputTokens?: number | null;
    usageOutputTokens?: number | null;
    usageCostUsd?: number | null;
    usageRequests?: number | null;
    autoApproveLowRisk?: boolean | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    lastLogin: TimestampString;
  } & User_Key;
}

export interface GetGeneratedCodeForRequestData {
  generatedCodes: ({
    id: UUIDString;
    summary: string;
    rollbackInstructions?: string | null;
    modelUsed: string;
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
    riskLevel?: string | null;
    changeScopeSummary?: string | null;
    createdAt: TimestampString;
  } & GeneratedCode_Key)[];
}

export interface GetGeneratedCodeForRequestVariables {
  requestId: UUIDString;
}

export interface GitHubConnection_Key {
  id: UUIDString;
  __typename?: 'GitHubConnection_Key';
}

export interface KnowledgeBase_Key {
  id: UUIDString;
  __typename?: 'KnowledgeBase_Key';
}

export interface ListCodeRequestsData {
  codeRequests: ({
    id: UUIDString;
    rawRequest: string;
    urgency?: string | null;
    areaOfApp?: string | null;
    status: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    project?: {
      id: UUIDString;
      name: string;
    } & Project_Key;
  } & CodeRequest_Key)[];
}

export interface ListCodeRequestsVariables {
  projectId?: UUIDString | null;
}

export interface ListGitHubConnectionsData {
  gitHubConnections: ({
    id: UUIDString;
    name: string;
    username?: string | null;
    defaultRepo?: string | null;
    defaultBranch: string;
    isActive: boolean;
  } & GitHubConnection_Key)[];
}

export interface ListKnowledgeBaseData {
  knowledgeBases: ({
    id: UUIDString;
    title: string;
    category: string;
    language?: string | null;
    framework?: string | null;
    description: string;
    priority: number;
    tone?: string | null;
    updatedAt: TimestampString;
  } & KnowledgeBase_Key)[];
}

export interface ListKnowledgeBaseVariables {
  projectId?: UUIDString | null;
}

export interface ListProjectsForUserData {
  projects: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    domain?: string | null;
    repositoryUrl?: string | null;
    techStack?: string[] | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Project_Key)[];
}

export interface ListServersData {
  servers: ({
    id: UUIDString;
    name: string;
    serverType: string;
    host: string;
    port: number;
    username: string;
    remotePath: string;
    description?: string | null;
    isActive: boolean;
    lastConnected?: TimestampString | null;
  } & Server_Key)[];
}

export interface ListWorkspacesData {
  workspaces: ({
    id: UUIDString;
    name: string;
    path: string;
    description?: string | null;
    isGitRepo: boolean;
    createdAt: TimestampString;
  } & Workspace_Key)[];
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface Server_Key {
  id: UUIDString;
  __typename?: 'Server_Key';
}

export interface UpdateCodeRequestStatusData {
  codeRequest_updateMany: number;
}

export interface UpdateCodeRequestStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateProjectData {
  project_updateMany: number;
}

export interface UpdateProjectVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  domain?: string | null;
  repositoryUrl?: string | null;
  techStack?: string[] | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string | null;
  plan: string;
  role: string;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface ValidationCheck_Key {
  id: UUIDString;
  __typename?: 'ValidationCheck_Key';
}

export interface Workspace_Key {
  id: UUIDString;
  __typename?: 'Workspace_Key';
}

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface CreateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  operationName: string;
}
export const createProjectRef: CreateProjectRef;

export function createProject(vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;
export function createProject(dc: DataConnect, vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface UpdateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
  operationName: string;
}
export const updateProjectRef: UpdateProjectRef;

export function updateProject(vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;
export function updateProject(dc: DataConnect, vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;

interface DeleteProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
  operationName: string;
}
export const deleteProjectRef: DeleteProjectRef;

export function deleteProject(vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;
export function deleteProject(dc: DataConnect, vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;

interface CreateCodeRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCodeRequestVariables): MutationRef<CreateCodeRequestData, CreateCodeRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCodeRequestVariables): MutationRef<CreateCodeRequestData, CreateCodeRequestVariables>;
  operationName: string;
}
export const createCodeRequestRef: CreateCodeRequestRef;

export function createCodeRequest(vars: CreateCodeRequestVariables): MutationPromise<CreateCodeRequestData, CreateCodeRequestVariables>;
export function createCodeRequest(dc: DataConnect, vars: CreateCodeRequestVariables): MutationPromise<CreateCodeRequestData, CreateCodeRequestVariables>;

interface UpdateCodeRequestStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCodeRequestStatusVariables): MutationRef<UpdateCodeRequestStatusData, UpdateCodeRequestStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCodeRequestStatusVariables): MutationRef<UpdateCodeRequestStatusData, UpdateCodeRequestStatusVariables>;
  operationName: string;
}
export const updateCodeRequestStatusRef: UpdateCodeRequestStatusRef;

export function updateCodeRequestStatus(vars: UpdateCodeRequestStatusVariables): MutationPromise<UpdateCodeRequestStatusData, UpdateCodeRequestStatusVariables>;
export function updateCodeRequestStatus(dc: DataConnect, vars: UpdateCodeRequestStatusVariables): MutationPromise<UpdateCodeRequestStatusData, UpdateCodeRequestStatusVariables>;

interface CreateKnowledgeBaseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateKnowledgeBaseVariables): MutationRef<CreateKnowledgeBaseData, CreateKnowledgeBaseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateKnowledgeBaseVariables): MutationRef<CreateKnowledgeBaseData, CreateKnowledgeBaseVariables>;
  operationName: string;
}
export const createKnowledgeBaseRef: CreateKnowledgeBaseRef;

export function createKnowledgeBase(vars: CreateKnowledgeBaseVariables): MutationPromise<CreateKnowledgeBaseData, CreateKnowledgeBaseVariables>;
export function createKnowledgeBase(dc: DataConnect, vars: CreateKnowledgeBaseVariables): MutationPromise<CreateKnowledgeBaseData, CreateKnowledgeBaseVariables>;

interface DeleteKnowledgeBaseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteKnowledgeBaseVariables): MutationRef<DeleteKnowledgeBaseData, DeleteKnowledgeBaseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteKnowledgeBaseVariables): MutationRef<DeleteKnowledgeBaseData, DeleteKnowledgeBaseVariables>;
  operationName: string;
}
export const deleteKnowledgeBaseRef: DeleteKnowledgeBaseRef;

export function deleteKnowledgeBase(vars: DeleteKnowledgeBaseVariables): MutationPromise<DeleteKnowledgeBaseData, DeleteKnowledgeBaseVariables>;
export function deleteKnowledgeBase(dc: DataConnect, vars: DeleteKnowledgeBaseVariables): MutationPromise<DeleteKnowledgeBaseData, DeleteKnowledgeBaseVariables>;

interface CreateWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkspaceVariables): MutationRef<CreateWorkspaceData, CreateWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateWorkspaceVariables): MutationRef<CreateWorkspaceData, CreateWorkspaceVariables>;
  operationName: string;
}
export const createWorkspaceRef: CreateWorkspaceRef;

export function createWorkspace(vars: CreateWorkspaceVariables): MutationPromise<CreateWorkspaceData, CreateWorkspaceVariables>;
export function createWorkspace(dc: DataConnect, vars: CreateWorkspaceVariables): MutationPromise<CreateWorkspaceData, CreateWorkspaceVariables>;

interface DeleteWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorkspaceVariables): MutationRef<DeleteWorkspaceData, DeleteWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteWorkspaceVariables): MutationRef<DeleteWorkspaceData, DeleteWorkspaceVariables>;
  operationName: string;
}
export const deleteWorkspaceRef: DeleteWorkspaceRef;

export function deleteWorkspace(vars: DeleteWorkspaceVariables): MutationPromise<DeleteWorkspaceData, DeleteWorkspaceVariables>;
export function deleteWorkspace(dc: DataConnect, vars: DeleteWorkspaceVariables): MutationPromise<DeleteWorkspaceData, DeleteWorkspaceVariables>;

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface ListProjectsForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProjectsForUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProjectsForUserData, undefined>;
  operationName: string;
}
export const listProjectsForUserRef: ListProjectsForUserRef;

export function listProjectsForUser(options?: ExecuteQueryOptions): QueryPromise<ListProjectsForUserData, undefined>;
export function listProjectsForUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProjectsForUserData, undefined>;

interface ListCodeRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListCodeRequestsVariables): QueryRef<ListCodeRequestsData, ListCodeRequestsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListCodeRequestsVariables): QueryRef<ListCodeRequestsData, ListCodeRequestsVariables>;
  operationName: string;
}
export const listCodeRequestsRef: ListCodeRequestsRef;

export function listCodeRequests(vars?: ListCodeRequestsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCodeRequestsData, ListCodeRequestsVariables>;
export function listCodeRequests(dc: DataConnect, vars?: ListCodeRequestsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCodeRequestsData, ListCodeRequestsVariables>;

interface GetGeneratedCodeForRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGeneratedCodeForRequestVariables): QueryRef<GetGeneratedCodeForRequestData, GetGeneratedCodeForRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetGeneratedCodeForRequestVariables): QueryRef<GetGeneratedCodeForRequestData, GetGeneratedCodeForRequestVariables>;
  operationName: string;
}
export const getGeneratedCodeForRequestRef: GetGeneratedCodeForRequestRef;

export function getGeneratedCodeForRequest(vars: GetGeneratedCodeForRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetGeneratedCodeForRequestData, GetGeneratedCodeForRequestVariables>;
export function getGeneratedCodeForRequest(dc: DataConnect, vars: GetGeneratedCodeForRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetGeneratedCodeForRequestData, GetGeneratedCodeForRequestVariables>;

interface ListKnowledgeBaseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListKnowledgeBaseVariables): QueryRef<ListKnowledgeBaseData, ListKnowledgeBaseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListKnowledgeBaseVariables): QueryRef<ListKnowledgeBaseData, ListKnowledgeBaseVariables>;
  operationName: string;
}
export const listKnowledgeBaseRef: ListKnowledgeBaseRef;

export function listKnowledgeBase(vars?: ListKnowledgeBaseVariables, options?: ExecuteQueryOptions): QueryPromise<ListKnowledgeBaseData, ListKnowledgeBaseVariables>;
export function listKnowledgeBase(dc: DataConnect, vars?: ListKnowledgeBaseVariables, options?: ExecuteQueryOptions): QueryPromise<ListKnowledgeBaseData, ListKnowledgeBaseVariables>;

interface ListServersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListServersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListServersData, undefined>;
  operationName: string;
}
export const listServersRef: ListServersRef;

export function listServers(options?: ExecuteQueryOptions): QueryPromise<ListServersData, undefined>;
export function listServers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListServersData, undefined>;

interface ListGitHubConnectionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListGitHubConnectionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListGitHubConnectionsData, undefined>;
  operationName: string;
}
export const listGitHubConnectionsRef: ListGitHubConnectionsRef;

export function listGitHubConnections(options?: ExecuteQueryOptions): QueryPromise<ListGitHubConnectionsData, undefined>;
export function listGitHubConnections(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListGitHubConnectionsData, undefined>;

interface ListWorkspacesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListWorkspacesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListWorkspacesData, undefined>;
  operationName: string;
}
export const listWorkspacesRef: ListWorkspacesRef;

export function listWorkspaces(options?: ExecuteQueryOptions): QueryPromise<ListWorkspacesData, undefined>;
export function listWorkspaces(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListWorkspacesData, undefined>;

