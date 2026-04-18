import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AppendChangeLogData {
  project_update?: Project_Key | null;
}

export interface AppendChangeLogVariables {
  id: UUIDString;
  changeLog: unknown;
}

export interface CodeRequest_Key {
  id: UUIDString;
  __typename?: 'CodeRequest_Key';
}

export interface CreateCodeRequestData {
  codeRequest_insert: CodeRequest_Key;
}

export interface CreateCodeRequestVariables {
  projectId: UUIDString;
  rawRequest: string;
  urgency?: string | null;
  areaOfApp?: string | null;
  screenshots?: unknown | null;
  links?: unknown | null;
  knowledgeBaseIds?: unknown | null;
}

export interface CreateDeployLogData {
  deployLog_insert: DeployLog_Key;
}

export interface CreateDeployLogVariables {
  serverId: UUIDString;
  projectId: UUIDString;
  uid: string;
  generatedCodeId?: UUIDString | null;
  filesDeployed?: unknown | null;
  status: string;
  errorMessage?: string | null;
}

export interface CreateGeneratedCodeData {
  generatedCode_insert: GeneratedCode_Key;
}

export interface CreateGeneratedCodeVariables {
  requestId: UUIDString;
  uid: string;
  structuredTask?: unknown | null;
  executionPlan?: unknown | null;
  codeChanges?: unknown | null;
  validationChecks?: unknown | null;
  summary?: string | null;
  rollbackInstructions?: string | null;
  modelUsed?: string | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  costUsd?: number | null;
  mode?: string | null;
}

export interface CreateKnowledgeEntryData {
  knowledgeEntry_insert: KnowledgeEntry_Key;
}

export interface CreateKnowledgeEntryVariables {
  projectId: UUIDString;
  title: string;
  category: string;
  language?: string | null;
  framework?: string | null;
  description?: string | null;
  codeExample?: string | null;
  badExample?: string | null;
  tags?: unknown | null;
  priority?: number | null;
}

export interface CreateProjectData {
  project_insert: Project_Key;
}

export interface CreateProjectVariables {
  name: string;
  domain?: string | null;
  description?: string | null;
  techStack?: unknown | null;
}

export interface CreateServerData {
  server_insert: Server_Key;
}

export interface CreateServerVariables {
  projectId: UUIDString;
  name: string;
  serverType: string;
  host: string;
  port: number;
  username: string;
  remotePath?: string | null;
  description?: string | null;
  credentialSecretName?: string | null;
}

export interface DeleteKnowledgeEntryData {
  knowledgeEntry_delete?: KnowledgeEntry_Key | null;
}

export interface DeleteKnowledgeEntryVariables {
  id: UUIDString;
}

export interface DeleteServerData {
  server_update?: Server_Key | null;
}

export interface DeleteServerVariables {
  id: UUIDString;
}

export interface DeployLog_Key {
  id: UUIDString;
  __typename?: 'DeployLog_Key';
}

export interface GeneratedCode_Key {
  id: UUIDString;
  __typename?: 'GeneratedCode_Key';
}

export interface GetCodeRequestWithCodeData {
  codeRequest?: {
    id: UUIDString;
    rawRequest: string;
    urgency?: string | null;
    areaOfApp?: string | null;
    status: string;
    modelUsed?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    generatedCodes_on_request: ({
      id: UUIDString;
      structuredTask?: unknown | null;
      executionPlan?: unknown | null;
      codeChanges?: unknown | null;
      validationChecks?: unknown | null;
      summary?: string | null;
      rollbackInstructions?: string | null;
      modelUsed?: string | null;
      inputTokens?: number | null;
      outputTokens?: number | null;
      costUsd?: number | null;
      mode?: string | null;
      createdAt: TimestampString;
    } & GeneratedCode_Key)[];
  } & CodeRequest_Key;
}

export interface GetCodeRequestWithCodeVariables {
  id: UUIDString;
}

export interface GetCurrentUserData {
  user?: {
    uid: string;
    email: string;
    displayName?: string | null;
    plan: string;
    aiModel?: string | null;
    maxTokens?: number | null;
    usageInputTokens: number;
    usageOutputTokens: number;
    usageCostUsd: number;
    usageRequests: number;
    usageResetAt?: TimestampString | null;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key;
}

export interface GetProjectData {
  project?: {
    id: UUIDString;
    user: {
      uid: string;
    } & User_Key;
      name: string;
      domain?: string | null;
      description?: string | null;
      techStack?: unknown | null;
      siteNotes?: string | null;
      brand?: unknown | null;
      intake?: unknown | null;
      changeLog?: unknown | null;
      isActive: boolean;
      deletedAt?: TimestampString | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & Project_Key;
}

export interface GetProjectVariables {
  id: UUIDString;
}

export interface GetServerForFunctionData {
  server?: {
    id: UUIDString;
    user: {
      uid: string;
    } & User_Key;
      serverType: string;
      host: string;
      port: number;
      username: string;
      remotePath?: string | null;
      credentialSecretName?: string | null;
      isActive: boolean;
  } & Server_Key;
}

export interface GetServerForFunctionVariables {
  id: UUIDString;
}

export interface KnowledgeEntry_Key {
  id: UUIDString;
  __typename?: 'KnowledgeEntry_Key';
}

export interface ListBrandKnowledgeData {
  knowledgeEntries: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    codeExample?: string | null;
    tags?: unknown | null;
    priority?: number | null;
  } & KnowledgeEntry_Key)[];
}

export interface ListBrandKnowledgeVariables {
  projectId: UUIDString;
}

export interface ListCodeRequestsByProjectData {
  codeRequests: ({
    id: UUIDString;
    rawRequest: string;
    urgency?: string | null;
    areaOfApp?: string | null;
    status: string;
    modelUsed?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & CodeRequest_Key)[];
}

export interface ListCodeRequestsByProjectVariables {
  projectId: UUIDString;
}

export interface ListDeployLogsByProjectData {
  deployLogs: ({
    id: UUIDString;
    status: string;
    errorMessage?: string | null;
    filesDeployed?: unknown | null;
    deployedAt: TimestampString;
    server: {
      id: UUIDString;
      name: string;
      host: string;
    } & Server_Key;
      generatedCode?: {
        id: UUIDString;
        summary?: string | null;
        modelUsed?: string | null;
      } & GeneratedCode_Key;
  } & DeployLog_Key)[];
}

export interface ListDeployLogsByProjectVariables {
  projectId: UUIDString;
  limit?: number | null;
}

export interface ListKnowledgeByProjectData {
  knowledgeEntries: ({
    id: UUIDString;
    title: string;
    category: string;
    language?: string | null;
    framework?: string | null;
    description?: string | null;
    codeExample?: string | null;
    badExample?: string | null;
    tags?: unknown | null;
    priority?: number | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & KnowledgeEntry_Key)[];
}

export interface ListKnowledgeByProjectVariables {
  projectId: UUIDString;
}

export interface ListProjectsData {
  projects: ({
    id: UUIDString;
    name: string;
    domain?: string | null;
    description?: string | null;
    techStack?: unknown | null;
    siteNotes?: string | null;
    brand?: unknown | null;
    intake?: unknown | null;
    changeLog?: unknown | null;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Project_Key)[];
}

export interface ListServersByProjectData {
  servers: ({
    id: UUIDString;
    name: string;
    serverType: string;
    host: string;
    port: number;
    username: string;
    remotePath?: string | null;
    description?: string | null;
    isActive: boolean;
    lastConnectedAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Server_Key)[];
}

export interface ListServersByProjectVariables {
  projectId: UUIDString;
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface RecordAiUsageData {
  user_update?: User_Key | null;
}

export interface RecordAiUsageVariables {
  uid: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  requests: number;
}

export interface RecordServerConnectionData {
  server_update?: Server_Key | null;
}

export interface RecordServerConnectionVariables {
  id: UUIDString;
}

export interface SaveProjectIntakeData {
  project_update?: Project_Key | null;
}

export interface SaveProjectIntakeVariables {
  id: UUIDString;
  intake: unknown;
}

export interface Server_Key {
  id: UUIDString;
  __typename?: 'Server_Key';
}

export interface SoftDeleteProjectData {
  project_update?: Project_Key | null;
}

export interface SoftDeleteProjectVariables {
  id: UUIDString;
}

export interface UpdateAiModelData {
  user_update?: User_Key | null;
}

export interface UpdateAiModelVariables {
  model: string;
  maxTokens?: number | null;
}

export interface UpdateCodeRequestStatusData {
  codeRequest_update?: CodeRequest_Key | null;
}

export interface UpdateCodeRequestStatusVariables {
  id: UUIDString;
  status: string;
  modelUsed?: string | null;
}

export interface UpdateKnowledgeEntryData {
  knowledgeEntry_update?: KnowledgeEntry_Key | null;
}

export interface UpdateKnowledgeEntryVariables {
  id: UUIDString;
  title?: string | null;
  category?: string | null;
  language?: string | null;
  framework?: string | null;
  description?: string | null;
  codeExample?: string | null;
  badExample?: string | null;
  tags?: unknown | null;
  priority?: number | null;
}

export interface UpdateProjectBrandData {
  project_update?: Project_Key | null;
}

export interface UpdateProjectBrandVariables {
  id: UUIDString;
  brand: unknown;
}

export interface UpdateProjectData {
  project_update?: Project_Key | null;
}

export interface UpdateProjectVariables {
  id: UUIDString;
  name?: string | null;
  domain?: string | null;
  description?: string | null;
  techStack?: unknown | null;
  siteNotes?: string | null;
}

export interface UpdateServerData {
  server_update?: Server_Key | null;
}

export interface UpdateServerVariables {
  id: UUIDString;
  name?: string | null;
  host?: string | null;
  port?: number | null;
  username?: string | null;
  remotePath?: string | null;
  description?: string | null;
  credentialSecretName?: string | null;
}

export interface UpdateUserPlanData {
  user_update?: User_Key | null;
}

export interface UpdateUserPlanVariables {
  uid: string;
  plan: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}

export interface UpdateUserProfileVariables {
  displayName: string;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  email: string;
  displayName?: string | null;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
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

interface UpdateUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  operationName: string;
}
export const updateUserProfileRef: UpdateUserProfileRef;

export function updateUserProfile(vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;
export function updateUserProfile(dc: DataConnect, vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateAiModelRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAiModelVariables): MutationRef<UpdateAiModelData, UpdateAiModelVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAiModelVariables): MutationRef<UpdateAiModelData, UpdateAiModelVariables>;
  operationName: string;
}
export const updateAiModelRef: UpdateAiModelRef;

export function updateAiModel(vars: UpdateAiModelVariables): MutationPromise<UpdateAiModelData, UpdateAiModelVariables>;
export function updateAiModel(dc: DataConnect, vars: UpdateAiModelVariables): MutationPromise<UpdateAiModelData, UpdateAiModelVariables>;

interface RecordAiUsageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordAiUsageVariables): MutationRef<RecordAiUsageData, RecordAiUsageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordAiUsageVariables): MutationRef<RecordAiUsageData, RecordAiUsageVariables>;
  operationName: string;
}
export const recordAiUsageRef: RecordAiUsageRef;

export function recordAiUsage(vars: RecordAiUsageVariables): MutationPromise<RecordAiUsageData, RecordAiUsageVariables>;
export function recordAiUsage(dc: DataConnect, vars: RecordAiUsageVariables): MutationPromise<RecordAiUsageData, RecordAiUsageVariables>;

interface UpdateUserPlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserPlanVariables): MutationRef<UpdateUserPlanData, UpdateUserPlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserPlanVariables): MutationRef<UpdateUserPlanData, UpdateUserPlanVariables>;
  operationName: string;
}
export const updateUserPlanRef: UpdateUserPlanRef;

export function updateUserPlan(vars: UpdateUserPlanVariables): MutationPromise<UpdateUserPlanData, UpdateUserPlanVariables>;
export function updateUserPlan(dc: DataConnect, vars: UpdateUserPlanVariables): MutationPromise<UpdateUserPlanData, UpdateUserPlanVariables>;

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

interface UpdateProjectBrandRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectBrandVariables): MutationRef<UpdateProjectBrandData, UpdateProjectBrandVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProjectBrandVariables): MutationRef<UpdateProjectBrandData, UpdateProjectBrandVariables>;
  operationName: string;
}
export const updateProjectBrandRef: UpdateProjectBrandRef;

export function updateProjectBrand(vars: UpdateProjectBrandVariables): MutationPromise<UpdateProjectBrandData, UpdateProjectBrandVariables>;
export function updateProjectBrand(dc: DataConnect, vars: UpdateProjectBrandVariables): MutationPromise<UpdateProjectBrandData, UpdateProjectBrandVariables>;

interface SaveProjectIntakeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveProjectIntakeVariables): MutationRef<SaveProjectIntakeData, SaveProjectIntakeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SaveProjectIntakeVariables): MutationRef<SaveProjectIntakeData, SaveProjectIntakeVariables>;
  operationName: string;
}
export const saveProjectIntakeRef: SaveProjectIntakeRef;

export function saveProjectIntake(vars: SaveProjectIntakeVariables): MutationPromise<SaveProjectIntakeData, SaveProjectIntakeVariables>;
export function saveProjectIntake(dc: DataConnect, vars: SaveProjectIntakeVariables): MutationPromise<SaveProjectIntakeData, SaveProjectIntakeVariables>;

interface AppendChangeLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AppendChangeLogVariables): MutationRef<AppendChangeLogData, AppendChangeLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AppendChangeLogVariables): MutationRef<AppendChangeLogData, AppendChangeLogVariables>;
  operationName: string;
}
export const appendChangeLogRef: AppendChangeLogRef;

export function appendChangeLog(vars: AppendChangeLogVariables): MutationPromise<AppendChangeLogData, AppendChangeLogVariables>;
export function appendChangeLog(dc: DataConnect, vars: AppendChangeLogVariables): MutationPromise<AppendChangeLogData, AppendChangeLogVariables>;

interface SoftDeleteProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SoftDeleteProjectVariables): MutationRef<SoftDeleteProjectData, SoftDeleteProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SoftDeleteProjectVariables): MutationRef<SoftDeleteProjectData, SoftDeleteProjectVariables>;
  operationName: string;
}
export const softDeleteProjectRef: SoftDeleteProjectRef;

export function softDeleteProject(vars: SoftDeleteProjectVariables): MutationPromise<SoftDeleteProjectData, SoftDeleteProjectVariables>;
export function softDeleteProject(dc: DataConnect, vars: SoftDeleteProjectVariables): MutationPromise<SoftDeleteProjectData, SoftDeleteProjectVariables>;

interface CreateKnowledgeEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateKnowledgeEntryVariables): MutationRef<CreateKnowledgeEntryData, CreateKnowledgeEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateKnowledgeEntryVariables): MutationRef<CreateKnowledgeEntryData, CreateKnowledgeEntryVariables>;
  operationName: string;
}
export const createKnowledgeEntryRef: CreateKnowledgeEntryRef;

export function createKnowledgeEntry(vars: CreateKnowledgeEntryVariables): MutationPromise<CreateKnowledgeEntryData, CreateKnowledgeEntryVariables>;
export function createKnowledgeEntry(dc: DataConnect, vars: CreateKnowledgeEntryVariables): MutationPromise<CreateKnowledgeEntryData, CreateKnowledgeEntryVariables>;

interface UpdateKnowledgeEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateKnowledgeEntryVariables): MutationRef<UpdateKnowledgeEntryData, UpdateKnowledgeEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateKnowledgeEntryVariables): MutationRef<UpdateKnowledgeEntryData, UpdateKnowledgeEntryVariables>;
  operationName: string;
}
export const updateKnowledgeEntryRef: UpdateKnowledgeEntryRef;

export function updateKnowledgeEntry(vars: UpdateKnowledgeEntryVariables): MutationPromise<UpdateKnowledgeEntryData, UpdateKnowledgeEntryVariables>;
export function updateKnowledgeEntry(dc: DataConnect, vars: UpdateKnowledgeEntryVariables): MutationPromise<UpdateKnowledgeEntryData, UpdateKnowledgeEntryVariables>;

interface DeleteKnowledgeEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteKnowledgeEntryVariables): MutationRef<DeleteKnowledgeEntryData, DeleteKnowledgeEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteKnowledgeEntryVariables): MutationRef<DeleteKnowledgeEntryData, DeleteKnowledgeEntryVariables>;
  operationName: string;
}
export const deleteKnowledgeEntryRef: DeleteKnowledgeEntryRef;

export function deleteKnowledgeEntry(vars: DeleteKnowledgeEntryVariables): MutationPromise<DeleteKnowledgeEntryData, DeleteKnowledgeEntryVariables>;
export function deleteKnowledgeEntry(dc: DataConnect, vars: DeleteKnowledgeEntryVariables): MutationPromise<DeleteKnowledgeEntryData, DeleteKnowledgeEntryVariables>;

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

interface CreateGeneratedCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGeneratedCodeVariables): MutationRef<CreateGeneratedCodeData, CreateGeneratedCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateGeneratedCodeVariables): MutationRef<CreateGeneratedCodeData, CreateGeneratedCodeVariables>;
  operationName: string;
}
export const createGeneratedCodeRef: CreateGeneratedCodeRef;

export function createGeneratedCode(vars: CreateGeneratedCodeVariables): MutationPromise<CreateGeneratedCodeData, CreateGeneratedCodeVariables>;
export function createGeneratedCode(dc: DataConnect, vars: CreateGeneratedCodeVariables): MutationPromise<CreateGeneratedCodeData, CreateGeneratedCodeVariables>;

interface CreateServerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServerVariables): MutationRef<CreateServerData, CreateServerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServerVariables): MutationRef<CreateServerData, CreateServerVariables>;
  operationName: string;
}
export const createServerRef: CreateServerRef;

export function createServer(vars: CreateServerVariables): MutationPromise<CreateServerData, CreateServerVariables>;
export function createServer(dc: DataConnect, vars: CreateServerVariables): MutationPromise<CreateServerData, CreateServerVariables>;

interface UpdateServerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServerVariables): MutationRef<UpdateServerData, UpdateServerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateServerVariables): MutationRef<UpdateServerData, UpdateServerVariables>;
  operationName: string;
}
export const updateServerRef: UpdateServerRef;

export function updateServer(vars: UpdateServerVariables): MutationPromise<UpdateServerData, UpdateServerVariables>;
export function updateServer(dc: DataConnect, vars: UpdateServerVariables): MutationPromise<UpdateServerData, UpdateServerVariables>;

interface RecordServerConnectionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordServerConnectionVariables): MutationRef<RecordServerConnectionData, RecordServerConnectionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordServerConnectionVariables): MutationRef<RecordServerConnectionData, RecordServerConnectionVariables>;
  operationName: string;
}
export const recordServerConnectionRef: RecordServerConnectionRef;

export function recordServerConnection(vars: RecordServerConnectionVariables): MutationPromise<RecordServerConnectionData, RecordServerConnectionVariables>;
export function recordServerConnection(dc: DataConnect, vars: RecordServerConnectionVariables): MutationPromise<RecordServerConnectionData, RecordServerConnectionVariables>;

interface DeleteServerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServerVariables): MutationRef<DeleteServerData, DeleteServerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServerVariables): MutationRef<DeleteServerData, DeleteServerVariables>;
  operationName: string;
}
export const deleteServerRef: DeleteServerRef;

export function deleteServer(vars: DeleteServerVariables): MutationPromise<DeleteServerData, DeleteServerVariables>;
export function deleteServer(dc: DataConnect, vars: DeleteServerVariables): MutationPromise<DeleteServerData, DeleteServerVariables>;

interface CreateDeployLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDeployLogVariables): MutationRef<CreateDeployLogData, CreateDeployLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDeployLogVariables): MutationRef<CreateDeployLogData, CreateDeployLogVariables>;
  operationName: string;
}
export const createDeployLogRef: CreateDeployLogRef;

export function createDeployLog(vars: CreateDeployLogVariables): MutationPromise<CreateDeployLogData, CreateDeployLogVariables>;
export function createDeployLog(dc: DataConnect, vars: CreateDeployLogVariables): MutationPromise<CreateDeployLogData, CreateDeployLogVariables>;

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

interface ListProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProjectsData, undefined>;
  operationName: string;
}
export const listProjectsRef: ListProjectsRef;

export function listProjects(options?: ExecuteQueryOptions): QueryPromise<ListProjectsData, undefined>;
export function listProjects(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProjectsData, undefined>;

interface GetProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
  operationName: string;
}
export const getProjectRef: GetProjectRef;

export function getProject(vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;
export function getProject(dc: DataConnect, vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;

interface ListKnowledgeByProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListKnowledgeByProjectVariables): QueryRef<ListKnowledgeByProjectData, ListKnowledgeByProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListKnowledgeByProjectVariables): QueryRef<ListKnowledgeByProjectData, ListKnowledgeByProjectVariables>;
  operationName: string;
}
export const listKnowledgeByProjectRef: ListKnowledgeByProjectRef;

export function listKnowledgeByProject(vars: ListKnowledgeByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListKnowledgeByProjectData, ListKnowledgeByProjectVariables>;
export function listKnowledgeByProject(dc: DataConnect, vars: ListKnowledgeByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListKnowledgeByProjectData, ListKnowledgeByProjectVariables>;

interface ListBrandKnowledgeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListBrandKnowledgeVariables): QueryRef<ListBrandKnowledgeData, ListBrandKnowledgeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListBrandKnowledgeVariables): QueryRef<ListBrandKnowledgeData, ListBrandKnowledgeVariables>;
  operationName: string;
}
export const listBrandKnowledgeRef: ListBrandKnowledgeRef;

export function listBrandKnowledge(vars: ListBrandKnowledgeVariables, options?: ExecuteQueryOptions): QueryPromise<ListBrandKnowledgeData, ListBrandKnowledgeVariables>;
export function listBrandKnowledge(dc: DataConnect, vars: ListBrandKnowledgeVariables, options?: ExecuteQueryOptions): QueryPromise<ListBrandKnowledgeData, ListBrandKnowledgeVariables>;

interface ListCodeRequestsByProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCodeRequestsByProjectVariables): QueryRef<ListCodeRequestsByProjectData, ListCodeRequestsByProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCodeRequestsByProjectVariables): QueryRef<ListCodeRequestsByProjectData, ListCodeRequestsByProjectVariables>;
  operationName: string;
}
export const listCodeRequestsByProjectRef: ListCodeRequestsByProjectRef;

export function listCodeRequestsByProject(vars: ListCodeRequestsByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListCodeRequestsByProjectData, ListCodeRequestsByProjectVariables>;
export function listCodeRequestsByProject(dc: DataConnect, vars: ListCodeRequestsByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListCodeRequestsByProjectData, ListCodeRequestsByProjectVariables>;

interface GetCodeRequestWithCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCodeRequestWithCodeVariables): QueryRef<GetCodeRequestWithCodeData, GetCodeRequestWithCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCodeRequestWithCodeVariables): QueryRef<GetCodeRequestWithCodeData, GetCodeRequestWithCodeVariables>;
  operationName: string;
}
export const getCodeRequestWithCodeRef: GetCodeRequestWithCodeRef;

export function getCodeRequestWithCode(vars: GetCodeRequestWithCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetCodeRequestWithCodeData, GetCodeRequestWithCodeVariables>;
export function getCodeRequestWithCode(dc: DataConnect, vars: GetCodeRequestWithCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetCodeRequestWithCodeData, GetCodeRequestWithCodeVariables>;

interface ListServersByProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListServersByProjectVariables): QueryRef<ListServersByProjectData, ListServersByProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListServersByProjectVariables): QueryRef<ListServersByProjectData, ListServersByProjectVariables>;
  operationName: string;
}
export const listServersByProjectRef: ListServersByProjectRef;

export function listServersByProject(vars: ListServersByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListServersByProjectData, ListServersByProjectVariables>;
export function listServersByProject(dc: DataConnect, vars: ListServersByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListServersByProjectData, ListServersByProjectVariables>;

interface GetServerForFunctionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServerForFunctionVariables): QueryRef<GetServerForFunctionData, GetServerForFunctionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServerForFunctionVariables): QueryRef<GetServerForFunctionData, GetServerForFunctionVariables>;
  operationName: string;
}
export const getServerForFunctionRef: GetServerForFunctionRef;

export function getServerForFunction(vars: GetServerForFunctionVariables, options?: ExecuteQueryOptions): QueryPromise<GetServerForFunctionData, GetServerForFunctionVariables>;
export function getServerForFunction(dc: DataConnect, vars: GetServerForFunctionVariables, options?: ExecuteQueryOptions): QueryPromise<GetServerForFunctionData, GetServerForFunctionVariables>;

interface ListDeployLogsByProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDeployLogsByProjectVariables): QueryRef<ListDeployLogsByProjectData, ListDeployLogsByProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListDeployLogsByProjectVariables): QueryRef<ListDeployLogsByProjectData, ListDeployLogsByProjectVariables>;
  operationName: string;
}
export const listDeployLogsByProjectRef: ListDeployLogsByProjectRef;

export function listDeployLogsByProject(vars: ListDeployLogsByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListDeployLogsByProjectData, ListDeployLogsByProjectVariables>;
export function listDeployLogsByProject(dc: DataConnect, vars: ListDeployLogsByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListDeployLogsByProjectData, ListDeployLogsByProjectVariables>;

