# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `code-helper-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*ListProjects*](#listprojects)
  - [*GetProject*](#getproject)
  - [*ListKnowledgeByProject*](#listknowledgebyproject)
  - [*ListBrandKnowledge*](#listbrandknowledge)
  - [*ListCodeRequestsByProject*](#listcoderequestsbyproject)
  - [*GetCodeRequestWithCode*](#getcoderequestwithcode)
  - [*ListServersByProject*](#listserversbyproject)
  - [*GetServerForFunction*](#getserverforfunction)
  - [*ListDeployLogsByProject*](#listdeploylogsbyproject)
- [**Mutations**](#mutations)
  - [*UpsertUser*](#upsertuser)
  - [*UpdateUserProfile*](#updateuserprofile)
  - [*UpdateAiModel*](#updateaimodel)
  - [*RecordAiUsage*](#recordaiusage)
  - [*UpdateUserPlan*](#updateuserplan)
  - [*CreateProject*](#createproject)
  - [*UpdateProject*](#updateproject)
  - [*UpdateProjectBrand*](#updateprojectbrand)
  - [*SaveProjectIntake*](#saveprojectintake)
  - [*AppendChangeLog*](#appendchangelog)
  - [*SoftDeleteProject*](#softdeleteproject)
  - [*CreateKnowledgeEntry*](#createknowledgeentry)
  - [*UpdateKnowledgeEntry*](#updateknowledgeentry)
  - [*DeleteKnowledgeEntry*](#deleteknowledgeentry)
  - [*CreateCodeRequest*](#createcoderequest)
  - [*UpdateCodeRequestStatus*](#updatecoderequeststatus)
  - [*CreateGeneratedCode*](#creategeneratedcode)
  - [*CreateServer*](#createserver)
  - [*UpdateServer*](#updateserver)
  - [*RecordServerConnection*](#recordserverconnection)
  - [*DeleteServer*](#deleteserver)
  - [*CreateDeployLog*](#createdeploylog)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `code-helper-connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@code-helper/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@code-helper/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@code-helper/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `code-helper-connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserRef:
```typescript
const name = getCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@code-helper/dataconnect';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@code-helper/dataconnect';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListProjects
You can execute the `ListProjects` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listProjects(options?: ExecuteQueryOptions): QueryPromise<ListProjectsData, undefined>;

interface ListProjectsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProjectsData, undefined>;
}
export const listProjectsRef: ListProjectsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProjects(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProjectsData, undefined>;

interface ListProjectsRef {
  ...
  (dc: DataConnect): QueryRef<ListProjectsData, undefined>;
}
export const listProjectsRef: ListProjectsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProjectsRef:
```typescript
const name = listProjectsRef.operationName;
console.log(name);
```

### Variables
The `ListProjects` query has no variables.
### Return Type
Recall that executing the `ListProjects` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProjectsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListProjects`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProjects } from '@code-helper/dataconnect';


// Call the `listProjects()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProjects();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProjects(dataConnect);

console.log(data.projects);

// Or, you can use the `Promise` API.
listProjects().then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

### Using `ListProjects`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProjectsRef } from '@code-helper/dataconnect';


// Call the `listProjectsRef()` function to get a reference to the query.
const ref = listProjectsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProjectsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.projects);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

## GetProject
You can execute the `GetProject` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getProject(vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;

interface GetProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
}
export const getProjectRef: GetProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProject(dc: DataConnect, vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;

interface GetProjectRef {
  ...
  (dc: DataConnect, vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
}
export const getProjectRef: GetProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProjectRef:
```typescript
const name = getProjectRef.operationName;
console.log(name);
```

### Variables
The `GetProject` query requires an argument of type `GetProjectVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProjectVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetProject` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProjectData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProject, GetProjectVariables } from '@code-helper/dataconnect';

// The `GetProject` query requires an argument of type `GetProjectVariables`:
const getProjectVars: GetProjectVariables = {
  id: ..., 
};

// Call the `getProject()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProject(getProjectVars);
// Variables can be defined inline as well.
const { data } = await getProject({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProject(dataConnect, getProjectVars);

console.log(data.project);

// Or, you can use the `Promise` API.
getProject(getProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project);
});
```

### Using `GetProject`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProjectRef, GetProjectVariables } from '@code-helper/dataconnect';

// The `GetProject` query requires an argument of type `GetProjectVariables`:
const getProjectVars: GetProjectVariables = {
  id: ..., 
};

// Call the `getProjectRef()` function to get a reference to the query.
const ref = getProjectRef(getProjectVars);
// Variables can be defined inline as well.
const ref = getProjectRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProjectRef(dataConnect, getProjectVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.project);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.project);
});
```

## ListKnowledgeByProject
You can execute the `ListKnowledgeByProject` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listKnowledgeByProject(vars: ListKnowledgeByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListKnowledgeByProjectData, ListKnowledgeByProjectVariables>;

interface ListKnowledgeByProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListKnowledgeByProjectVariables): QueryRef<ListKnowledgeByProjectData, ListKnowledgeByProjectVariables>;
}
export const listKnowledgeByProjectRef: ListKnowledgeByProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listKnowledgeByProject(dc: DataConnect, vars: ListKnowledgeByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListKnowledgeByProjectData, ListKnowledgeByProjectVariables>;

interface ListKnowledgeByProjectRef {
  ...
  (dc: DataConnect, vars: ListKnowledgeByProjectVariables): QueryRef<ListKnowledgeByProjectData, ListKnowledgeByProjectVariables>;
}
export const listKnowledgeByProjectRef: ListKnowledgeByProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listKnowledgeByProjectRef:
```typescript
const name = listKnowledgeByProjectRef.operationName;
console.log(name);
```

### Variables
The `ListKnowledgeByProject` query requires an argument of type `ListKnowledgeByProjectVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListKnowledgeByProjectVariables {
  projectId: UUIDString;
}
```
### Return Type
Recall that executing the `ListKnowledgeByProject` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListKnowledgeByProjectData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListKnowledgeByProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listKnowledgeByProject, ListKnowledgeByProjectVariables } from '@code-helper/dataconnect';

// The `ListKnowledgeByProject` query requires an argument of type `ListKnowledgeByProjectVariables`:
const listKnowledgeByProjectVars: ListKnowledgeByProjectVariables = {
  projectId: ..., 
};

// Call the `listKnowledgeByProject()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listKnowledgeByProject(listKnowledgeByProjectVars);
// Variables can be defined inline as well.
const { data } = await listKnowledgeByProject({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listKnowledgeByProject(dataConnect, listKnowledgeByProjectVars);

console.log(data.knowledgeEntries);

// Or, you can use the `Promise` API.
listKnowledgeByProject(listKnowledgeByProjectVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntries);
});
```

### Using `ListKnowledgeByProject`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listKnowledgeByProjectRef, ListKnowledgeByProjectVariables } from '@code-helper/dataconnect';

// The `ListKnowledgeByProject` query requires an argument of type `ListKnowledgeByProjectVariables`:
const listKnowledgeByProjectVars: ListKnowledgeByProjectVariables = {
  projectId: ..., 
};

// Call the `listKnowledgeByProjectRef()` function to get a reference to the query.
const ref = listKnowledgeByProjectRef(listKnowledgeByProjectVars);
// Variables can be defined inline as well.
const ref = listKnowledgeByProjectRef({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listKnowledgeByProjectRef(dataConnect, listKnowledgeByProjectVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.knowledgeEntries);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntries);
});
```

## ListBrandKnowledge
You can execute the `ListBrandKnowledge` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listBrandKnowledge(vars: ListBrandKnowledgeVariables, options?: ExecuteQueryOptions): QueryPromise<ListBrandKnowledgeData, ListBrandKnowledgeVariables>;

interface ListBrandKnowledgeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListBrandKnowledgeVariables): QueryRef<ListBrandKnowledgeData, ListBrandKnowledgeVariables>;
}
export const listBrandKnowledgeRef: ListBrandKnowledgeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBrandKnowledge(dc: DataConnect, vars: ListBrandKnowledgeVariables, options?: ExecuteQueryOptions): QueryPromise<ListBrandKnowledgeData, ListBrandKnowledgeVariables>;

interface ListBrandKnowledgeRef {
  ...
  (dc: DataConnect, vars: ListBrandKnowledgeVariables): QueryRef<ListBrandKnowledgeData, ListBrandKnowledgeVariables>;
}
export const listBrandKnowledgeRef: ListBrandKnowledgeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBrandKnowledgeRef:
```typescript
const name = listBrandKnowledgeRef.operationName;
console.log(name);
```

### Variables
The `ListBrandKnowledge` query requires an argument of type `ListBrandKnowledgeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListBrandKnowledgeVariables {
  projectId: UUIDString;
}
```
### Return Type
Recall that executing the `ListBrandKnowledge` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBrandKnowledgeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListBrandKnowledge`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBrandKnowledge, ListBrandKnowledgeVariables } from '@code-helper/dataconnect';

// The `ListBrandKnowledge` query requires an argument of type `ListBrandKnowledgeVariables`:
const listBrandKnowledgeVars: ListBrandKnowledgeVariables = {
  projectId: ..., 
};

// Call the `listBrandKnowledge()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBrandKnowledge(listBrandKnowledgeVars);
// Variables can be defined inline as well.
const { data } = await listBrandKnowledge({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBrandKnowledge(dataConnect, listBrandKnowledgeVars);

console.log(data.knowledgeEntries);

// Or, you can use the `Promise` API.
listBrandKnowledge(listBrandKnowledgeVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntries);
});
```

### Using `ListBrandKnowledge`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBrandKnowledgeRef, ListBrandKnowledgeVariables } from '@code-helper/dataconnect';

// The `ListBrandKnowledge` query requires an argument of type `ListBrandKnowledgeVariables`:
const listBrandKnowledgeVars: ListBrandKnowledgeVariables = {
  projectId: ..., 
};

// Call the `listBrandKnowledgeRef()` function to get a reference to the query.
const ref = listBrandKnowledgeRef(listBrandKnowledgeVars);
// Variables can be defined inline as well.
const ref = listBrandKnowledgeRef({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBrandKnowledgeRef(dataConnect, listBrandKnowledgeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.knowledgeEntries);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntries);
});
```

## ListCodeRequestsByProject
You can execute the `ListCodeRequestsByProject` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCodeRequestsByProject(vars: ListCodeRequestsByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListCodeRequestsByProjectData, ListCodeRequestsByProjectVariables>;

interface ListCodeRequestsByProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCodeRequestsByProjectVariables): QueryRef<ListCodeRequestsByProjectData, ListCodeRequestsByProjectVariables>;
}
export const listCodeRequestsByProjectRef: ListCodeRequestsByProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCodeRequestsByProject(dc: DataConnect, vars: ListCodeRequestsByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListCodeRequestsByProjectData, ListCodeRequestsByProjectVariables>;

interface ListCodeRequestsByProjectRef {
  ...
  (dc: DataConnect, vars: ListCodeRequestsByProjectVariables): QueryRef<ListCodeRequestsByProjectData, ListCodeRequestsByProjectVariables>;
}
export const listCodeRequestsByProjectRef: ListCodeRequestsByProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCodeRequestsByProjectRef:
```typescript
const name = listCodeRequestsByProjectRef.operationName;
console.log(name);
```

### Variables
The `ListCodeRequestsByProject` query requires an argument of type `ListCodeRequestsByProjectVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCodeRequestsByProjectVariables {
  projectId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCodeRequestsByProject` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCodeRequestsByProjectData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListCodeRequestsByProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCodeRequestsByProject, ListCodeRequestsByProjectVariables } from '@code-helper/dataconnect';

// The `ListCodeRequestsByProject` query requires an argument of type `ListCodeRequestsByProjectVariables`:
const listCodeRequestsByProjectVars: ListCodeRequestsByProjectVariables = {
  projectId: ..., 
};

// Call the `listCodeRequestsByProject()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCodeRequestsByProject(listCodeRequestsByProjectVars);
// Variables can be defined inline as well.
const { data } = await listCodeRequestsByProject({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCodeRequestsByProject(dataConnect, listCodeRequestsByProjectVars);

console.log(data.codeRequests);

// Or, you can use the `Promise` API.
listCodeRequestsByProject(listCodeRequestsByProjectVars).then((response) => {
  const data = response.data;
  console.log(data.codeRequests);
});
```

### Using `ListCodeRequestsByProject`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCodeRequestsByProjectRef, ListCodeRequestsByProjectVariables } from '@code-helper/dataconnect';

// The `ListCodeRequestsByProject` query requires an argument of type `ListCodeRequestsByProjectVariables`:
const listCodeRequestsByProjectVars: ListCodeRequestsByProjectVariables = {
  projectId: ..., 
};

// Call the `listCodeRequestsByProjectRef()` function to get a reference to the query.
const ref = listCodeRequestsByProjectRef(listCodeRequestsByProjectVars);
// Variables can be defined inline as well.
const ref = listCodeRequestsByProjectRef({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCodeRequestsByProjectRef(dataConnect, listCodeRequestsByProjectVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.codeRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.codeRequests);
});
```

## GetCodeRequestWithCode
You can execute the `GetCodeRequestWithCode` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getCodeRequestWithCode(vars: GetCodeRequestWithCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetCodeRequestWithCodeData, GetCodeRequestWithCodeVariables>;

interface GetCodeRequestWithCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCodeRequestWithCodeVariables): QueryRef<GetCodeRequestWithCodeData, GetCodeRequestWithCodeVariables>;
}
export const getCodeRequestWithCodeRef: GetCodeRequestWithCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCodeRequestWithCode(dc: DataConnect, vars: GetCodeRequestWithCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetCodeRequestWithCodeData, GetCodeRequestWithCodeVariables>;

interface GetCodeRequestWithCodeRef {
  ...
  (dc: DataConnect, vars: GetCodeRequestWithCodeVariables): QueryRef<GetCodeRequestWithCodeData, GetCodeRequestWithCodeVariables>;
}
export const getCodeRequestWithCodeRef: GetCodeRequestWithCodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCodeRequestWithCodeRef:
```typescript
const name = getCodeRequestWithCodeRef.operationName;
console.log(name);
```

### Variables
The `GetCodeRequestWithCode` query requires an argument of type `GetCodeRequestWithCodeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCodeRequestWithCodeVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetCodeRequestWithCode` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCodeRequestWithCodeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetCodeRequestWithCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCodeRequestWithCode, GetCodeRequestWithCodeVariables } from '@code-helper/dataconnect';

// The `GetCodeRequestWithCode` query requires an argument of type `GetCodeRequestWithCodeVariables`:
const getCodeRequestWithCodeVars: GetCodeRequestWithCodeVariables = {
  id: ..., 
};

// Call the `getCodeRequestWithCode()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCodeRequestWithCode(getCodeRequestWithCodeVars);
// Variables can be defined inline as well.
const { data } = await getCodeRequestWithCode({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCodeRequestWithCode(dataConnect, getCodeRequestWithCodeVars);

console.log(data.codeRequest);

// Or, you can use the `Promise` API.
getCodeRequestWithCode(getCodeRequestWithCodeVars).then((response) => {
  const data = response.data;
  console.log(data.codeRequest);
});
```

### Using `GetCodeRequestWithCode`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCodeRequestWithCodeRef, GetCodeRequestWithCodeVariables } from '@code-helper/dataconnect';

// The `GetCodeRequestWithCode` query requires an argument of type `GetCodeRequestWithCodeVariables`:
const getCodeRequestWithCodeVars: GetCodeRequestWithCodeVariables = {
  id: ..., 
};

// Call the `getCodeRequestWithCodeRef()` function to get a reference to the query.
const ref = getCodeRequestWithCodeRef(getCodeRequestWithCodeVars);
// Variables can be defined inline as well.
const ref = getCodeRequestWithCodeRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCodeRequestWithCodeRef(dataConnect, getCodeRequestWithCodeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.codeRequest);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.codeRequest);
});
```

## ListServersByProject
You can execute the `ListServersByProject` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listServersByProject(vars: ListServersByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListServersByProjectData, ListServersByProjectVariables>;

interface ListServersByProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListServersByProjectVariables): QueryRef<ListServersByProjectData, ListServersByProjectVariables>;
}
export const listServersByProjectRef: ListServersByProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listServersByProject(dc: DataConnect, vars: ListServersByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListServersByProjectData, ListServersByProjectVariables>;

interface ListServersByProjectRef {
  ...
  (dc: DataConnect, vars: ListServersByProjectVariables): QueryRef<ListServersByProjectData, ListServersByProjectVariables>;
}
export const listServersByProjectRef: ListServersByProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listServersByProjectRef:
```typescript
const name = listServersByProjectRef.operationName;
console.log(name);
```

### Variables
The `ListServersByProject` query requires an argument of type `ListServersByProjectVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListServersByProjectVariables {
  projectId: UUIDString;
}
```
### Return Type
Recall that executing the `ListServersByProject` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListServersByProjectData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListServersByProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listServersByProject, ListServersByProjectVariables } from '@code-helper/dataconnect';

// The `ListServersByProject` query requires an argument of type `ListServersByProjectVariables`:
const listServersByProjectVars: ListServersByProjectVariables = {
  projectId: ..., 
};

// Call the `listServersByProject()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listServersByProject(listServersByProjectVars);
// Variables can be defined inline as well.
const { data } = await listServersByProject({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listServersByProject(dataConnect, listServersByProjectVars);

console.log(data.servers);

// Or, you can use the `Promise` API.
listServersByProject(listServersByProjectVars).then((response) => {
  const data = response.data;
  console.log(data.servers);
});
```

### Using `ListServersByProject`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listServersByProjectRef, ListServersByProjectVariables } from '@code-helper/dataconnect';

// The `ListServersByProject` query requires an argument of type `ListServersByProjectVariables`:
const listServersByProjectVars: ListServersByProjectVariables = {
  projectId: ..., 
};

// Call the `listServersByProjectRef()` function to get a reference to the query.
const ref = listServersByProjectRef(listServersByProjectVars);
// Variables can be defined inline as well.
const ref = listServersByProjectRef({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listServersByProjectRef(dataConnect, listServersByProjectVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.servers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.servers);
});
```

## GetServerForFunction
You can execute the `GetServerForFunction` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getServerForFunction(vars: GetServerForFunctionVariables, options?: ExecuteQueryOptions): QueryPromise<GetServerForFunctionData, GetServerForFunctionVariables>;

interface GetServerForFunctionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServerForFunctionVariables): QueryRef<GetServerForFunctionData, GetServerForFunctionVariables>;
}
export const getServerForFunctionRef: GetServerForFunctionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServerForFunction(dc: DataConnect, vars: GetServerForFunctionVariables, options?: ExecuteQueryOptions): QueryPromise<GetServerForFunctionData, GetServerForFunctionVariables>;

interface GetServerForFunctionRef {
  ...
  (dc: DataConnect, vars: GetServerForFunctionVariables): QueryRef<GetServerForFunctionData, GetServerForFunctionVariables>;
}
export const getServerForFunctionRef: GetServerForFunctionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServerForFunctionRef:
```typescript
const name = getServerForFunctionRef.operationName;
console.log(name);
```

### Variables
The `GetServerForFunction` query requires an argument of type `GetServerForFunctionVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServerForFunctionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetServerForFunction` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServerForFunctionData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetServerForFunction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServerForFunction, GetServerForFunctionVariables } from '@code-helper/dataconnect';

// The `GetServerForFunction` query requires an argument of type `GetServerForFunctionVariables`:
const getServerForFunctionVars: GetServerForFunctionVariables = {
  id: ..., 
};

// Call the `getServerForFunction()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServerForFunction(getServerForFunctionVars);
// Variables can be defined inline as well.
const { data } = await getServerForFunction({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServerForFunction(dataConnect, getServerForFunctionVars);

console.log(data.server);

// Or, you can use the `Promise` API.
getServerForFunction(getServerForFunctionVars).then((response) => {
  const data = response.data;
  console.log(data.server);
});
```

### Using `GetServerForFunction`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServerForFunctionRef, GetServerForFunctionVariables } from '@code-helper/dataconnect';

// The `GetServerForFunction` query requires an argument of type `GetServerForFunctionVariables`:
const getServerForFunctionVars: GetServerForFunctionVariables = {
  id: ..., 
};

// Call the `getServerForFunctionRef()` function to get a reference to the query.
const ref = getServerForFunctionRef(getServerForFunctionVars);
// Variables can be defined inline as well.
const ref = getServerForFunctionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServerForFunctionRef(dataConnect, getServerForFunctionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.server);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.server);
});
```

## ListDeployLogsByProject
You can execute the `ListDeployLogsByProject` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listDeployLogsByProject(vars: ListDeployLogsByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListDeployLogsByProjectData, ListDeployLogsByProjectVariables>;

interface ListDeployLogsByProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDeployLogsByProjectVariables): QueryRef<ListDeployLogsByProjectData, ListDeployLogsByProjectVariables>;
}
export const listDeployLogsByProjectRef: ListDeployLogsByProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDeployLogsByProject(dc: DataConnect, vars: ListDeployLogsByProjectVariables, options?: ExecuteQueryOptions): QueryPromise<ListDeployLogsByProjectData, ListDeployLogsByProjectVariables>;

interface ListDeployLogsByProjectRef {
  ...
  (dc: DataConnect, vars: ListDeployLogsByProjectVariables): QueryRef<ListDeployLogsByProjectData, ListDeployLogsByProjectVariables>;
}
export const listDeployLogsByProjectRef: ListDeployLogsByProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDeployLogsByProjectRef:
```typescript
const name = listDeployLogsByProjectRef.operationName;
console.log(name);
```

### Variables
The `ListDeployLogsByProject` query requires an argument of type `ListDeployLogsByProjectVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListDeployLogsByProjectVariables {
  projectId: UUIDString;
  limit?: number | null;
}
```
### Return Type
Recall that executing the `ListDeployLogsByProject` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDeployLogsByProjectData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListDeployLogsByProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDeployLogsByProject, ListDeployLogsByProjectVariables } from '@code-helper/dataconnect';

// The `ListDeployLogsByProject` query requires an argument of type `ListDeployLogsByProjectVariables`:
const listDeployLogsByProjectVars: ListDeployLogsByProjectVariables = {
  projectId: ..., 
  limit: ..., // optional
};

// Call the `listDeployLogsByProject()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDeployLogsByProject(listDeployLogsByProjectVars);
// Variables can be defined inline as well.
const { data } = await listDeployLogsByProject({ projectId: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDeployLogsByProject(dataConnect, listDeployLogsByProjectVars);

console.log(data.deployLogs);

// Or, you can use the `Promise` API.
listDeployLogsByProject(listDeployLogsByProjectVars).then((response) => {
  const data = response.data;
  console.log(data.deployLogs);
});
```

### Using `ListDeployLogsByProject`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDeployLogsByProjectRef, ListDeployLogsByProjectVariables } from '@code-helper/dataconnect';

// The `ListDeployLogsByProject` query requires an argument of type `ListDeployLogsByProjectVariables`:
const listDeployLogsByProjectVars: ListDeployLogsByProjectVariables = {
  projectId: ..., 
  limit: ..., // optional
};

// Call the `listDeployLogsByProjectRef()` function to get a reference to the query.
const ref = listDeployLogsByProjectRef(listDeployLogsByProjectVars);
// Variables can be defined inline as well.
const ref = listDeployLogsByProjectRef({ projectId: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDeployLogsByProjectRef(dataConnect, listDeployLogsByProjectVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.deployLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.deployLogs);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `code-helper-connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  email: string;
  displayName?: string | null;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@code-helper/dataconnect';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  email: ..., 
  displayName: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@code-helper/dataconnect';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  email: ..., 
  displayName: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## UpdateUserProfile
You can execute the `UpdateUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateUserProfile(vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserProfile(dc: DataConnect, vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  (dc: DataConnect, vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserProfileRef:
```typescript
const name = updateUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserProfileVariables {
  displayName: string;
}
```
### Return Type
Recall that executing the `UpdateUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserProfile, UpdateUserProfileVariables } from '@code-helper/dataconnect';

// The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  displayName: ..., 
};

// Call the `updateUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserProfile(updateUserProfileVars);
// Variables can be defined inline as well.
const { data } = await updateUserProfile({ displayName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserProfile(dataConnect, updateUserProfileVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserProfile(updateUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserProfileRef, UpdateUserProfileVariables } from '@code-helper/dataconnect';

// The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  displayName: ..., 
};

// Call the `updateUserProfileRef()` function to get a reference to the mutation.
const ref = updateUserProfileRef(updateUserProfileVars);
// Variables can be defined inline as well.
const ref = updateUserProfileRef({ displayName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserProfileRef(dataConnect, updateUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateAiModel
You can execute the `UpdateAiModel` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateAiModel(vars: UpdateAiModelVariables): MutationPromise<UpdateAiModelData, UpdateAiModelVariables>;

interface UpdateAiModelRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAiModelVariables): MutationRef<UpdateAiModelData, UpdateAiModelVariables>;
}
export const updateAiModelRef: UpdateAiModelRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAiModel(dc: DataConnect, vars: UpdateAiModelVariables): MutationPromise<UpdateAiModelData, UpdateAiModelVariables>;

interface UpdateAiModelRef {
  ...
  (dc: DataConnect, vars: UpdateAiModelVariables): MutationRef<UpdateAiModelData, UpdateAiModelVariables>;
}
export const updateAiModelRef: UpdateAiModelRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAiModelRef:
```typescript
const name = updateAiModelRef.operationName;
console.log(name);
```

### Variables
The `UpdateAiModel` mutation requires an argument of type `UpdateAiModelVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAiModelVariables {
  model: string;
  maxTokens?: number | null;
}
```
### Return Type
Recall that executing the `UpdateAiModel` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAiModelData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAiModelData {
  user_update?: User_Key | null;
}
```
### Using `UpdateAiModel`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAiModel, UpdateAiModelVariables } from '@code-helper/dataconnect';

// The `UpdateAiModel` mutation requires an argument of type `UpdateAiModelVariables`:
const updateAiModelVars: UpdateAiModelVariables = {
  model: ..., 
  maxTokens: ..., // optional
};

// Call the `updateAiModel()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAiModel(updateAiModelVars);
// Variables can be defined inline as well.
const { data } = await updateAiModel({ model: ..., maxTokens: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAiModel(dataConnect, updateAiModelVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateAiModel(updateAiModelVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateAiModel`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAiModelRef, UpdateAiModelVariables } from '@code-helper/dataconnect';

// The `UpdateAiModel` mutation requires an argument of type `UpdateAiModelVariables`:
const updateAiModelVars: UpdateAiModelVariables = {
  model: ..., 
  maxTokens: ..., // optional
};

// Call the `updateAiModelRef()` function to get a reference to the mutation.
const ref = updateAiModelRef(updateAiModelVars);
// Variables can be defined inline as well.
const ref = updateAiModelRef({ model: ..., maxTokens: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAiModelRef(dataConnect, updateAiModelVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## RecordAiUsage
You can execute the `RecordAiUsage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
recordAiUsage(vars: RecordAiUsageVariables): MutationPromise<RecordAiUsageData, RecordAiUsageVariables>;

interface RecordAiUsageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordAiUsageVariables): MutationRef<RecordAiUsageData, RecordAiUsageVariables>;
}
export const recordAiUsageRef: RecordAiUsageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordAiUsage(dc: DataConnect, vars: RecordAiUsageVariables): MutationPromise<RecordAiUsageData, RecordAiUsageVariables>;

interface RecordAiUsageRef {
  ...
  (dc: DataConnect, vars: RecordAiUsageVariables): MutationRef<RecordAiUsageData, RecordAiUsageVariables>;
}
export const recordAiUsageRef: RecordAiUsageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordAiUsageRef:
```typescript
const name = recordAiUsageRef.operationName;
console.log(name);
```

### Variables
The `RecordAiUsage` mutation requires an argument of type `RecordAiUsageVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordAiUsageVariables {
  uid: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  requests: number;
}
```
### Return Type
Recall that executing the `RecordAiUsage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordAiUsageData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordAiUsageData {
  user_update?: User_Key | null;
}
```
### Using `RecordAiUsage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordAiUsage, RecordAiUsageVariables } from '@code-helper/dataconnect';

// The `RecordAiUsage` mutation requires an argument of type `RecordAiUsageVariables`:
const recordAiUsageVars: RecordAiUsageVariables = {
  uid: ..., 
  inputTokens: ..., 
  outputTokens: ..., 
  costUsd: ..., 
  requests: ..., 
};

// Call the `recordAiUsage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordAiUsage(recordAiUsageVars);
// Variables can be defined inline as well.
const { data } = await recordAiUsage({ uid: ..., inputTokens: ..., outputTokens: ..., costUsd: ..., requests: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordAiUsage(dataConnect, recordAiUsageVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
recordAiUsage(recordAiUsageVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `RecordAiUsage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordAiUsageRef, RecordAiUsageVariables } from '@code-helper/dataconnect';

// The `RecordAiUsage` mutation requires an argument of type `RecordAiUsageVariables`:
const recordAiUsageVars: RecordAiUsageVariables = {
  uid: ..., 
  inputTokens: ..., 
  outputTokens: ..., 
  costUsd: ..., 
  requests: ..., 
};

// Call the `recordAiUsageRef()` function to get a reference to the mutation.
const ref = recordAiUsageRef(recordAiUsageVars);
// Variables can be defined inline as well.
const ref = recordAiUsageRef({ uid: ..., inputTokens: ..., outputTokens: ..., costUsd: ..., requests: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordAiUsageRef(dataConnect, recordAiUsageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateUserPlan
You can execute the `UpdateUserPlan` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateUserPlan(vars: UpdateUserPlanVariables): MutationPromise<UpdateUserPlanData, UpdateUserPlanVariables>;

interface UpdateUserPlanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserPlanVariables): MutationRef<UpdateUserPlanData, UpdateUserPlanVariables>;
}
export const updateUserPlanRef: UpdateUserPlanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserPlan(dc: DataConnect, vars: UpdateUserPlanVariables): MutationPromise<UpdateUserPlanData, UpdateUserPlanVariables>;

interface UpdateUserPlanRef {
  ...
  (dc: DataConnect, vars: UpdateUserPlanVariables): MutationRef<UpdateUserPlanData, UpdateUserPlanVariables>;
}
export const updateUserPlanRef: UpdateUserPlanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserPlanRef:
```typescript
const name = updateUserPlanRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserPlan` mutation requires an argument of type `UpdateUserPlanVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserPlanVariables {
  uid: string;
  plan: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUserPlan` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserPlanData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserPlanData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserPlan`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserPlan, UpdateUserPlanVariables } from '@code-helper/dataconnect';

// The `UpdateUserPlan` mutation requires an argument of type `UpdateUserPlanVariables`:
const updateUserPlanVars: UpdateUserPlanVariables = {
  uid: ..., 
  plan: ..., 
  stripeCustomerId: ..., // optional
  stripeSubscriptionId: ..., // optional
};

// Call the `updateUserPlan()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserPlan(updateUserPlanVars);
// Variables can be defined inline as well.
const { data } = await updateUserPlan({ uid: ..., plan: ..., stripeCustomerId: ..., stripeSubscriptionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserPlan(dataConnect, updateUserPlanVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserPlan(updateUserPlanVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserPlan`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserPlanRef, UpdateUserPlanVariables } from '@code-helper/dataconnect';

// The `UpdateUserPlan` mutation requires an argument of type `UpdateUserPlanVariables`:
const updateUserPlanVars: UpdateUserPlanVariables = {
  uid: ..., 
  plan: ..., 
  stripeCustomerId: ..., // optional
  stripeSubscriptionId: ..., // optional
};

// Call the `updateUserPlanRef()` function to get a reference to the mutation.
const ref = updateUserPlanRef(updateUserPlanVars);
// Variables can be defined inline as well.
const ref = updateUserPlanRef({ uid: ..., plan: ..., stripeCustomerId: ..., stripeSubscriptionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserPlanRef(dataConnect, updateUserPlanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## CreateProject
You can execute the `CreateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createProject(vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface CreateProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
}
export const createProjectRef: CreateProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProject(dc: DataConnect, vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface CreateProjectRef {
  ...
  (dc: DataConnect, vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
}
export const createProjectRef: CreateProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProjectRef:
```typescript
const name = createProjectRef.operationName;
console.log(name);
```

### Variables
The `CreateProject` mutation requires an argument of type `CreateProjectVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProjectVariables {
  name: string;
  domain?: string | null;
  description?: string | null;
  techStack?: unknown | null;
}
```
### Return Type
Recall that executing the `CreateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProjectData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProjectData {
  project_insert: Project_Key;
}
```
### Using `CreateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProject, CreateProjectVariables } from '@code-helper/dataconnect';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  name: ..., 
  domain: ..., // optional
  description: ..., // optional
  techStack: ..., // optional
};

// Call the `createProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProject(createProjectVars);
// Variables can be defined inline as well.
const { data } = await createProject({ name: ..., domain: ..., description: ..., techStack: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProject(dataConnect, createProjectVars);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
createProject(createProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

### Using `CreateProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProjectRef, CreateProjectVariables } from '@code-helper/dataconnect';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  name: ..., 
  domain: ..., // optional
  description: ..., // optional
  techStack: ..., // optional
};

// Call the `createProjectRef()` function to get a reference to the mutation.
const ref = createProjectRef(createProjectVars);
// Variables can be defined inline as well.
const ref = createProjectRef({ name: ..., domain: ..., description: ..., techStack: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProjectRef(dataConnect, createProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_insert);
});
```

## UpdateProject
You can execute the `UpdateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateProject(vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;

interface UpdateProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
}
export const updateProjectRef: UpdateProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProject(dc: DataConnect, vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;

interface UpdateProjectRef {
  ...
  (dc: DataConnect, vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
}
export const updateProjectRef: UpdateProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProjectRef:
```typescript
const name = updateProjectRef.operationName;
console.log(name);
```

### Variables
The `UpdateProject` mutation requires an argument of type `UpdateProjectVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProjectVariables {
  id: UUIDString;
  name?: string | null;
  domain?: string | null;
  description?: string | null;
  techStack?: unknown | null;
  siteNotes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProjectData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProjectData {
  project_update?: Project_Key | null;
}
```
### Using `UpdateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProject, UpdateProjectVariables } from '@code-helper/dataconnect';

// The `UpdateProject` mutation requires an argument of type `UpdateProjectVariables`:
const updateProjectVars: UpdateProjectVariables = {
  id: ..., 
  name: ..., // optional
  domain: ..., // optional
  description: ..., // optional
  techStack: ..., // optional
  siteNotes: ..., // optional
};

// Call the `updateProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProject(updateProjectVars);
// Variables can be defined inline as well.
const { data } = await updateProject({ id: ..., name: ..., domain: ..., description: ..., techStack: ..., siteNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProject(dataConnect, updateProjectVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
updateProject(updateProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `UpdateProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProjectRef, UpdateProjectVariables } from '@code-helper/dataconnect';

// The `UpdateProject` mutation requires an argument of type `UpdateProjectVariables`:
const updateProjectVars: UpdateProjectVariables = {
  id: ..., 
  name: ..., // optional
  domain: ..., // optional
  description: ..., // optional
  techStack: ..., // optional
  siteNotes: ..., // optional
};

// Call the `updateProjectRef()` function to get a reference to the mutation.
const ref = updateProjectRef(updateProjectVars);
// Variables can be defined inline as well.
const ref = updateProjectRef({ id: ..., name: ..., domain: ..., description: ..., techStack: ..., siteNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProjectRef(dataConnect, updateProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## UpdateProjectBrand
You can execute the `UpdateProjectBrand` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateProjectBrand(vars: UpdateProjectBrandVariables): MutationPromise<UpdateProjectBrandData, UpdateProjectBrandVariables>;

interface UpdateProjectBrandRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectBrandVariables): MutationRef<UpdateProjectBrandData, UpdateProjectBrandVariables>;
}
export const updateProjectBrandRef: UpdateProjectBrandRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProjectBrand(dc: DataConnect, vars: UpdateProjectBrandVariables): MutationPromise<UpdateProjectBrandData, UpdateProjectBrandVariables>;

interface UpdateProjectBrandRef {
  ...
  (dc: DataConnect, vars: UpdateProjectBrandVariables): MutationRef<UpdateProjectBrandData, UpdateProjectBrandVariables>;
}
export const updateProjectBrandRef: UpdateProjectBrandRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProjectBrandRef:
```typescript
const name = updateProjectBrandRef.operationName;
console.log(name);
```

### Variables
The `UpdateProjectBrand` mutation requires an argument of type `UpdateProjectBrandVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProjectBrandVariables {
  id: UUIDString;
  brand: unknown;
}
```
### Return Type
Recall that executing the `UpdateProjectBrand` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProjectBrandData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProjectBrandData {
  project_update?: Project_Key | null;
}
```
### Using `UpdateProjectBrand`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProjectBrand, UpdateProjectBrandVariables } from '@code-helper/dataconnect';

// The `UpdateProjectBrand` mutation requires an argument of type `UpdateProjectBrandVariables`:
const updateProjectBrandVars: UpdateProjectBrandVariables = {
  id: ..., 
  brand: ..., 
};

// Call the `updateProjectBrand()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProjectBrand(updateProjectBrandVars);
// Variables can be defined inline as well.
const { data } = await updateProjectBrand({ id: ..., brand: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProjectBrand(dataConnect, updateProjectBrandVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
updateProjectBrand(updateProjectBrandVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `UpdateProjectBrand`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProjectBrandRef, UpdateProjectBrandVariables } from '@code-helper/dataconnect';

// The `UpdateProjectBrand` mutation requires an argument of type `UpdateProjectBrandVariables`:
const updateProjectBrandVars: UpdateProjectBrandVariables = {
  id: ..., 
  brand: ..., 
};

// Call the `updateProjectBrandRef()` function to get a reference to the mutation.
const ref = updateProjectBrandRef(updateProjectBrandVars);
// Variables can be defined inline as well.
const ref = updateProjectBrandRef({ id: ..., brand: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProjectBrandRef(dataConnect, updateProjectBrandVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## SaveProjectIntake
You can execute the `SaveProjectIntake` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
saveProjectIntake(vars: SaveProjectIntakeVariables): MutationPromise<SaveProjectIntakeData, SaveProjectIntakeVariables>;

interface SaveProjectIntakeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveProjectIntakeVariables): MutationRef<SaveProjectIntakeData, SaveProjectIntakeVariables>;
}
export const saveProjectIntakeRef: SaveProjectIntakeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
saveProjectIntake(dc: DataConnect, vars: SaveProjectIntakeVariables): MutationPromise<SaveProjectIntakeData, SaveProjectIntakeVariables>;

interface SaveProjectIntakeRef {
  ...
  (dc: DataConnect, vars: SaveProjectIntakeVariables): MutationRef<SaveProjectIntakeData, SaveProjectIntakeVariables>;
}
export const saveProjectIntakeRef: SaveProjectIntakeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the saveProjectIntakeRef:
```typescript
const name = saveProjectIntakeRef.operationName;
console.log(name);
```

### Variables
The `SaveProjectIntake` mutation requires an argument of type `SaveProjectIntakeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SaveProjectIntakeVariables {
  id: UUIDString;
  intake: unknown;
}
```
### Return Type
Recall that executing the `SaveProjectIntake` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SaveProjectIntakeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SaveProjectIntakeData {
  project_update?: Project_Key | null;
}
```
### Using `SaveProjectIntake`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, saveProjectIntake, SaveProjectIntakeVariables } from '@code-helper/dataconnect';

// The `SaveProjectIntake` mutation requires an argument of type `SaveProjectIntakeVariables`:
const saveProjectIntakeVars: SaveProjectIntakeVariables = {
  id: ..., 
  intake: ..., 
};

// Call the `saveProjectIntake()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await saveProjectIntake(saveProjectIntakeVars);
// Variables can be defined inline as well.
const { data } = await saveProjectIntake({ id: ..., intake: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await saveProjectIntake(dataConnect, saveProjectIntakeVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
saveProjectIntake(saveProjectIntakeVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `SaveProjectIntake`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, saveProjectIntakeRef, SaveProjectIntakeVariables } from '@code-helper/dataconnect';

// The `SaveProjectIntake` mutation requires an argument of type `SaveProjectIntakeVariables`:
const saveProjectIntakeVars: SaveProjectIntakeVariables = {
  id: ..., 
  intake: ..., 
};

// Call the `saveProjectIntakeRef()` function to get a reference to the mutation.
const ref = saveProjectIntakeRef(saveProjectIntakeVars);
// Variables can be defined inline as well.
const ref = saveProjectIntakeRef({ id: ..., intake: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = saveProjectIntakeRef(dataConnect, saveProjectIntakeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## AppendChangeLog
You can execute the `AppendChangeLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
appendChangeLog(vars: AppendChangeLogVariables): MutationPromise<AppendChangeLogData, AppendChangeLogVariables>;

interface AppendChangeLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AppendChangeLogVariables): MutationRef<AppendChangeLogData, AppendChangeLogVariables>;
}
export const appendChangeLogRef: AppendChangeLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
appendChangeLog(dc: DataConnect, vars: AppendChangeLogVariables): MutationPromise<AppendChangeLogData, AppendChangeLogVariables>;

interface AppendChangeLogRef {
  ...
  (dc: DataConnect, vars: AppendChangeLogVariables): MutationRef<AppendChangeLogData, AppendChangeLogVariables>;
}
export const appendChangeLogRef: AppendChangeLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the appendChangeLogRef:
```typescript
const name = appendChangeLogRef.operationName;
console.log(name);
```

### Variables
The `AppendChangeLog` mutation requires an argument of type `AppendChangeLogVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AppendChangeLogVariables {
  id: UUIDString;
  changeLog: unknown;
}
```
### Return Type
Recall that executing the `AppendChangeLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AppendChangeLogData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AppendChangeLogData {
  project_update?: Project_Key | null;
}
```
### Using `AppendChangeLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, appendChangeLog, AppendChangeLogVariables } from '@code-helper/dataconnect';

// The `AppendChangeLog` mutation requires an argument of type `AppendChangeLogVariables`:
const appendChangeLogVars: AppendChangeLogVariables = {
  id: ..., 
  changeLog: ..., 
};

// Call the `appendChangeLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await appendChangeLog(appendChangeLogVars);
// Variables can be defined inline as well.
const { data } = await appendChangeLog({ id: ..., changeLog: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await appendChangeLog(dataConnect, appendChangeLogVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
appendChangeLog(appendChangeLogVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `AppendChangeLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, appendChangeLogRef, AppendChangeLogVariables } from '@code-helper/dataconnect';

// The `AppendChangeLog` mutation requires an argument of type `AppendChangeLogVariables`:
const appendChangeLogVars: AppendChangeLogVariables = {
  id: ..., 
  changeLog: ..., 
};

// Call the `appendChangeLogRef()` function to get a reference to the mutation.
const ref = appendChangeLogRef(appendChangeLogVars);
// Variables can be defined inline as well.
const ref = appendChangeLogRef({ id: ..., changeLog: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = appendChangeLogRef(dataConnect, appendChangeLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## SoftDeleteProject
You can execute the `SoftDeleteProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
softDeleteProject(vars: SoftDeleteProjectVariables): MutationPromise<SoftDeleteProjectData, SoftDeleteProjectVariables>;

interface SoftDeleteProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SoftDeleteProjectVariables): MutationRef<SoftDeleteProjectData, SoftDeleteProjectVariables>;
}
export const softDeleteProjectRef: SoftDeleteProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
softDeleteProject(dc: DataConnect, vars: SoftDeleteProjectVariables): MutationPromise<SoftDeleteProjectData, SoftDeleteProjectVariables>;

interface SoftDeleteProjectRef {
  ...
  (dc: DataConnect, vars: SoftDeleteProjectVariables): MutationRef<SoftDeleteProjectData, SoftDeleteProjectVariables>;
}
export const softDeleteProjectRef: SoftDeleteProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the softDeleteProjectRef:
```typescript
const name = softDeleteProjectRef.operationName;
console.log(name);
```

### Variables
The `SoftDeleteProject` mutation requires an argument of type `SoftDeleteProjectVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SoftDeleteProjectVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `SoftDeleteProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SoftDeleteProjectData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SoftDeleteProjectData {
  project_update?: Project_Key | null;
}
```
### Using `SoftDeleteProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, softDeleteProject, SoftDeleteProjectVariables } from '@code-helper/dataconnect';

// The `SoftDeleteProject` mutation requires an argument of type `SoftDeleteProjectVariables`:
const softDeleteProjectVars: SoftDeleteProjectVariables = {
  id: ..., 
};

// Call the `softDeleteProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await softDeleteProject(softDeleteProjectVars);
// Variables can be defined inline as well.
const { data } = await softDeleteProject({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await softDeleteProject(dataConnect, softDeleteProjectVars);

console.log(data.project_update);

// Or, you can use the `Promise` API.
softDeleteProject(softDeleteProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

### Using `SoftDeleteProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, softDeleteProjectRef, SoftDeleteProjectVariables } from '@code-helper/dataconnect';

// The `SoftDeleteProject` mutation requires an argument of type `SoftDeleteProjectVariables`:
const softDeleteProjectVars: SoftDeleteProjectVariables = {
  id: ..., 
};

// Call the `softDeleteProjectRef()` function to get a reference to the mutation.
const ref = softDeleteProjectRef(softDeleteProjectVars);
// Variables can be defined inline as well.
const ref = softDeleteProjectRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = softDeleteProjectRef(dataConnect, softDeleteProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_update);
});
```

## CreateKnowledgeEntry
You can execute the `CreateKnowledgeEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createKnowledgeEntry(vars: CreateKnowledgeEntryVariables): MutationPromise<CreateKnowledgeEntryData, CreateKnowledgeEntryVariables>;

interface CreateKnowledgeEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateKnowledgeEntryVariables): MutationRef<CreateKnowledgeEntryData, CreateKnowledgeEntryVariables>;
}
export const createKnowledgeEntryRef: CreateKnowledgeEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createKnowledgeEntry(dc: DataConnect, vars: CreateKnowledgeEntryVariables): MutationPromise<CreateKnowledgeEntryData, CreateKnowledgeEntryVariables>;

interface CreateKnowledgeEntryRef {
  ...
  (dc: DataConnect, vars: CreateKnowledgeEntryVariables): MutationRef<CreateKnowledgeEntryData, CreateKnowledgeEntryVariables>;
}
export const createKnowledgeEntryRef: CreateKnowledgeEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createKnowledgeEntryRef:
```typescript
const name = createKnowledgeEntryRef.operationName;
console.log(name);
```

### Variables
The `CreateKnowledgeEntry` mutation requires an argument of type `CreateKnowledgeEntryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateKnowledgeEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateKnowledgeEntryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateKnowledgeEntryData {
  knowledgeEntry_insert: KnowledgeEntry_Key;
}
```
### Using `CreateKnowledgeEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createKnowledgeEntry, CreateKnowledgeEntryVariables } from '@code-helper/dataconnect';

// The `CreateKnowledgeEntry` mutation requires an argument of type `CreateKnowledgeEntryVariables`:
const createKnowledgeEntryVars: CreateKnowledgeEntryVariables = {
  projectId: ..., 
  title: ..., 
  category: ..., 
  language: ..., // optional
  framework: ..., // optional
  description: ..., // optional
  codeExample: ..., // optional
  badExample: ..., // optional
  tags: ..., // optional
  priority: ..., // optional
};

// Call the `createKnowledgeEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createKnowledgeEntry(createKnowledgeEntryVars);
// Variables can be defined inline as well.
const { data } = await createKnowledgeEntry({ projectId: ..., title: ..., category: ..., language: ..., framework: ..., description: ..., codeExample: ..., badExample: ..., tags: ..., priority: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createKnowledgeEntry(dataConnect, createKnowledgeEntryVars);

console.log(data.knowledgeEntry_insert);

// Or, you can use the `Promise` API.
createKnowledgeEntry(createKnowledgeEntryVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntry_insert);
});
```

### Using `CreateKnowledgeEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createKnowledgeEntryRef, CreateKnowledgeEntryVariables } from '@code-helper/dataconnect';

// The `CreateKnowledgeEntry` mutation requires an argument of type `CreateKnowledgeEntryVariables`:
const createKnowledgeEntryVars: CreateKnowledgeEntryVariables = {
  projectId: ..., 
  title: ..., 
  category: ..., 
  language: ..., // optional
  framework: ..., // optional
  description: ..., // optional
  codeExample: ..., // optional
  badExample: ..., // optional
  tags: ..., // optional
  priority: ..., // optional
};

// Call the `createKnowledgeEntryRef()` function to get a reference to the mutation.
const ref = createKnowledgeEntryRef(createKnowledgeEntryVars);
// Variables can be defined inline as well.
const ref = createKnowledgeEntryRef({ projectId: ..., title: ..., category: ..., language: ..., framework: ..., description: ..., codeExample: ..., badExample: ..., tags: ..., priority: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createKnowledgeEntryRef(dataConnect, createKnowledgeEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.knowledgeEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntry_insert);
});
```

## UpdateKnowledgeEntry
You can execute the `UpdateKnowledgeEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateKnowledgeEntry(vars: UpdateKnowledgeEntryVariables): MutationPromise<UpdateKnowledgeEntryData, UpdateKnowledgeEntryVariables>;

interface UpdateKnowledgeEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateKnowledgeEntryVariables): MutationRef<UpdateKnowledgeEntryData, UpdateKnowledgeEntryVariables>;
}
export const updateKnowledgeEntryRef: UpdateKnowledgeEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateKnowledgeEntry(dc: DataConnect, vars: UpdateKnowledgeEntryVariables): MutationPromise<UpdateKnowledgeEntryData, UpdateKnowledgeEntryVariables>;

interface UpdateKnowledgeEntryRef {
  ...
  (dc: DataConnect, vars: UpdateKnowledgeEntryVariables): MutationRef<UpdateKnowledgeEntryData, UpdateKnowledgeEntryVariables>;
}
export const updateKnowledgeEntryRef: UpdateKnowledgeEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateKnowledgeEntryRef:
```typescript
const name = updateKnowledgeEntryRef.operationName;
console.log(name);
```

### Variables
The `UpdateKnowledgeEntry` mutation requires an argument of type `UpdateKnowledgeEntryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateKnowledgeEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateKnowledgeEntryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateKnowledgeEntryData {
  knowledgeEntry_update?: KnowledgeEntry_Key | null;
}
```
### Using `UpdateKnowledgeEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateKnowledgeEntry, UpdateKnowledgeEntryVariables } from '@code-helper/dataconnect';

// The `UpdateKnowledgeEntry` mutation requires an argument of type `UpdateKnowledgeEntryVariables`:
const updateKnowledgeEntryVars: UpdateKnowledgeEntryVariables = {
  id: ..., 
  title: ..., // optional
  category: ..., // optional
  language: ..., // optional
  framework: ..., // optional
  description: ..., // optional
  codeExample: ..., // optional
  badExample: ..., // optional
  tags: ..., // optional
  priority: ..., // optional
};

// Call the `updateKnowledgeEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateKnowledgeEntry(updateKnowledgeEntryVars);
// Variables can be defined inline as well.
const { data } = await updateKnowledgeEntry({ id: ..., title: ..., category: ..., language: ..., framework: ..., description: ..., codeExample: ..., badExample: ..., tags: ..., priority: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateKnowledgeEntry(dataConnect, updateKnowledgeEntryVars);

console.log(data.knowledgeEntry_update);

// Or, you can use the `Promise` API.
updateKnowledgeEntry(updateKnowledgeEntryVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntry_update);
});
```

### Using `UpdateKnowledgeEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateKnowledgeEntryRef, UpdateKnowledgeEntryVariables } from '@code-helper/dataconnect';

// The `UpdateKnowledgeEntry` mutation requires an argument of type `UpdateKnowledgeEntryVariables`:
const updateKnowledgeEntryVars: UpdateKnowledgeEntryVariables = {
  id: ..., 
  title: ..., // optional
  category: ..., // optional
  language: ..., // optional
  framework: ..., // optional
  description: ..., // optional
  codeExample: ..., // optional
  badExample: ..., // optional
  tags: ..., // optional
  priority: ..., // optional
};

// Call the `updateKnowledgeEntryRef()` function to get a reference to the mutation.
const ref = updateKnowledgeEntryRef(updateKnowledgeEntryVars);
// Variables can be defined inline as well.
const ref = updateKnowledgeEntryRef({ id: ..., title: ..., category: ..., language: ..., framework: ..., description: ..., codeExample: ..., badExample: ..., tags: ..., priority: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateKnowledgeEntryRef(dataConnect, updateKnowledgeEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.knowledgeEntry_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntry_update);
});
```

## DeleteKnowledgeEntry
You can execute the `DeleteKnowledgeEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteKnowledgeEntry(vars: DeleteKnowledgeEntryVariables): MutationPromise<DeleteKnowledgeEntryData, DeleteKnowledgeEntryVariables>;

interface DeleteKnowledgeEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteKnowledgeEntryVariables): MutationRef<DeleteKnowledgeEntryData, DeleteKnowledgeEntryVariables>;
}
export const deleteKnowledgeEntryRef: DeleteKnowledgeEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteKnowledgeEntry(dc: DataConnect, vars: DeleteKnowledgeEntryVariables): MutationPromise<DeleteKnowledgeEntryData, DeleteKnowledgeEntryVariables>;

interface DeleteKnowledgeEntryRef {
  ...
  (dc: DataConnect, vars: DeleteKnowledgeEntryVariables): MutationRef<DeleteKnowledgeEntryData, DeleteKnowledgeEntryVariables>;
}
export const deleteKnowledgeEntryRef: DeleteKnowledgeEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteKnowledgeEntryRef:
```typescript
const name = deleteKnowledgeEntryRef.operationName;
console.log(name);
```

### Variables
The `DeleteKnowledgeEntry` mutation requires an argument of type `DeleteKnowledgeEntryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteKnowledgeEntryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteKnowledgeEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteKnowledgeEntryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteKnowledgeEntryData {
  knowledgeEntry_delete?: KnowledgeEntry_Key | null;
}
```
### Using `DeleteKnowledgeEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteKnowledgeEntry, DeleteKnowledgeEntryVariables } from '@code-helper/dataconnect';

// The `DeleteKnowledgeEntry` mutation requires an argument of type `DeleteKnowledgeEntryVariables`:
const deleteKnowledgeEntryVars: DeleteKnowledgeEntryVariables = {
  id: ..., 
};

// Call the `deleteKnowledgeEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteKnowledgeEntry(deleteKnowledgeEntryVars);
// Variables can be defined inline as well.
const { data } = await deleteKnowledgeEntry({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteKnowledgeEntry(dataConnect, deleteKnowledgeEntryVars);

console.log(data.knowledgeEntry_delete);

// Or, you can use the `Promise` API.
deleteKnowledgeEntry(deleteKnowledgeEntryVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntry_delete);
});
```

### Using `DeleteKnowledgeEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteKnowledgeEntryRef, DeleteKnowledgeEntryVariables } from '@code-helper/dataconnect';

// The `DeleteKnowledgeEntry` mutation requires an argument of type `DeleteKnowledgeEntryVariables`:
const deleteKnowledgeEntryVars: DeleteKnowledgeEntryVariables = {
  id: ..., 
};

// Call the `deleteKnowledgeEntryRef()` function to get a reference to the mutation.
const ref = deleteKnowledgeEntryRef(deleteKnowledgeEntryVars);
// Variables can be defined inline as well.
const ref = deleteKnowledgeEntryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteKnowledgeEntryRef(dataConnect, deleteKnowledgeEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.knowledgeEntry_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeEntry_delete);
});
```

## CreateCodeRequest
You can execute the `CreateCodeRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createCodeRequest(vars: CreateCodeRequestVariables): MutationPromise<CreateCodeRequestData, CreateCodeRequestVariables>;

interface CreateCodeRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCodeRequestVariables): MutationRef<CreateCodeRequestData, CreateCodeRequestVariables>;
}
export const createCodeRequestRef: CreateCodeRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCodeRequest(dc: DataConnect, vars: CreateCodeRequestVariables): MutationPromise<CreateCodeRequestData, CreateCodeRequestVariables>;

interface CreateCodeRequestRef {
  ...
  (dc: DataConnect, vars: CreateCodeRequestVariables): MutationRef<CreateCodeRequestData, CreateCodeRequestVariables>;
}
export const createCodeRequestRef: CreateCodeRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCodeRequestRef:
```typescript
const name = createCodeRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateCodeRequest` mutation requires an argument of type `CreateCodeRequestVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCodeRequestVariables {
  projectId: UUIDString;
  rawRequest: string;
  urgency?: string | null;
  areaOfApp?: string | null;
  screenshots?: unknown | null;
  links?: unknown | null;
  knowledgeBaseIds?: unknown | null;
}
```
### Return Type
Recall that executing the `CreateCodeRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCodeRequestData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCodeRequestData {
  codeRequest_insert: CodeRequest_Key;
}
```
### Using `CreateCodeRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCodeRequest, CreateCodeRequestVariables } from '@code-helper/dataconnect';

// The `CreateCodeRequest` mutation requires an argument of type `CreateCodeRequestVariables`:
const createCodeRequestVars: CreateCodeRequestVariables = {
  projectId: ..., 
  rawRequest: ..., 
  urgency: ..., // optional
  areaOfApp: ..., // optional
  screenshots: ..., // optional
  links: ..., // optional
  knowledgeBaseIds: ..., // optional
};

// Call the `createCodeRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCodeRequest(createCodeRequestVars);
// Variables can be defined inline as well.
const { data } = await createCodeRequest({ projectId: ..., rawRequest: ..., urgency: ..., areaOfApp: ..., screenshots: ..., links: ..., knowledgeBaseIds: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCodeRequest(dataConnect, createCodeRequestVars);

console.log(data.codeRequest_insert);

// Or, you can use the `Promise` API.
createCodeRequest(createCodeRequestVars).then((response) => {
  const data = response.data;
  console.log(data.codeRequest_insert);
});
```

### Using `CreateCodeRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCodeRequestRef, CreateCodeRequestVariables } from '@code-helper/dataconnect';

// The `CreateCodeRequest` mutation requires an argument of type `CreateCodeRequestVariables`:
const createCodeRequestVars: CreateCodeRequestVariables = {
  projectId: ..., 
  rawRequest: ..., 
  urgency: ..., // optional
  areaOfApp: ..., // optional
  screenshots: ..., // optional
  links: ..., // optional
  knowledgeBaseIds: ..., // optional
};

// Call the `createCodeRequestRef()` function to get a reference to the mutation.
const ref = createCodeRequestRef(createCodeRequestVars);
// Variables can be defined inline as well.
const ref = createCodeRequestRef({ projectId: ..., rawRequest: ..., urgency: ..., areaOfApp: ..., screenshots: ..., links: ..., knowledgeBaseIds: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCodeRequestRef(dataConnect, createCodeRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.codeRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.codeRequest_insert);
});
```

## UpdateCodeRequestStatus
You can execute the `UpdateCodeRequestStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateCodeRequestStatus(vars: UpdateCodeRequestStatusVariables): MutationPromise<UpdateCodeRequestStatusData, UpdateCodeRequestStatusVariables>;

interface UpdateCodeRequestStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCodeRequestStatusVariables): MutationRef<UpdateCodeRequestStatusData, UpdateCodeRequestStatusVariables>;
}
export const updateCodeRequestStatusRef: UpdateCodeRequestStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCodeRequestStatus(dc: DataConnect, vars: UpdateCodeRequestStatusVariables): MutationPromise<UpdateCodeRequestStatusData, UpdateCodeRequestStatusVariables>;

interface UpdateCodeRequestStatusRef {
  ...
  (dc: DataConnect, vars: UpdateCodeRequestStatusVariables): MutationRef<UpdateCodeRequestStatusData, UpdateCodeRequestStatusVariables>;
}
export const updateCodeRequestStatusRef: UpdateCodeRequestStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCodeRequestStatusRef:
```typescript
const name = updateCodeRequestStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateCodeRequestStatus` mutation requires an argument of type `UpdateCodeRequestStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCodeRequestStatusVariables {
  id: UUIDString;
  status: string;
  modelUsed?: string | null;
}
```
### Return Type
Recall that executing the `UpdateCodeRequestStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCodeRequestStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCodeRequestStatusData {
  codeRequest_update?: CodeRequest_Key | null;
}
```
### Using `UpdateCodeRequestStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCodeRequestStatus, UpdateCodeRequestStatusVariables } from '@code-helper/dataconnect';

// The `UpdateCodeRequestStatus` mutation requires an argument of type `UpdateCodeRequestStatusVariables`:
const updateCodeRequestStatusVars: UpdateCodeRequestStatusVariables = {
  id: ..., 
  status: ..., 
  modelUsed: ..., // optional
};

// Call the `updateCodeRequestStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCodeRequestStatus(updateCodeRequestStatusVars);
// Variables can be defined inline as well.
const { data } = await updateCodeRequestStatus({ id: ..., status: ..., modelUsed: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCodeRequestStatus(dataConnect, updateCodeRequestStatusVars);

console.log(data.codeRequest_update);

// Or, you can use the `Promise` API.
updateCodeRequestStatus(updateCodeRequestStatusVars).then((response) => {
  const data = response.data;
  console.log(data.codeRequest_update);
});
```

### Using `UpdateCodeRequestStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCodeRequestStatusRef, UpdateCodeRequestStatusVariables } from '@code-helper/dataconnect';

// The `UpdateCodeRequestStatus` mutation requires an argument of type `UpdateCodeRequestStatusVariables`:
const updateCodeRequestStatusVars: UpdateCodeRequestStatusVariables = {
  id: ..., 
  status: ..., 
  modelUsed: ..., // optional
};

// Call the `updateCodeRequestStatusRef()` function to get a reference to the mutation.
const ref = updateCodeRequestStatusRef(updateCodeRequestStatusVars);
// Variables can be defined inline as well.
const ref = updateCodeRequestStatusRef({ id: ..., status: ..., modelUsed: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCodeRequestStatusRef(dataConnect, updateCodeRequestStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.codeRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.codeRequest_update);
});
```

## CreateGeneratedCode
You can execute the `CreateGeneratedCode` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createGeneratedCode(vars: CreateGeneratedCodeVariables): MutationPromise<CreateGeneratedCodeData, CreateGeneratedCodeVariables>;

interface CreateGeneratedCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGeneratedCodeVariables): MutationRef<CreateGeneratedCodeData, CreateGeneratedCodeVariables>;
}
export const createGeneratedCodeRef: CreateGeneratedCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createGeneratedCode(dc: DataConnect, vars: CreateGeneratedCodeVariables): MutationPromise<CreateGeneratedCodeData, CreateGeneratedCodeVariables>;

interface CreateGeneratedCodeRef {
  ...
  (dc: DataConnect, vars: CreateGeneratedCodeVariables): MutationRef<CreateGeneratedCodeData, CreateGeneratedCodeVariables>;
}
export const createGeneratedCodeRef: CreateGeneratedCodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createGeneratedCodeRef:
```typescript
const name = createGeneratedCodeRef.operationName;
console.log(name);
```

### Variables
The `CreateGeneratedCode` mutation requires an argument of type `CreateGeneratedCodeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateGeneratedCode` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateGeneratedCodeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateGeneratedCodeData {
  generatedCode_insert: GeneratedCode_Key;
}
```
### Using `CreateGeneratedCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createGeneratedCode, CreateGeneratedCodeVariables } from '@code-helper/dataconnect';

// The `CreateGeneratedCode` mutation requires an argument of type `CreateGeneratedCodeVariables`:
const createGeneratedCodeVars: CreateGeneratedCodeVariables = {
  requestId: ..., 
  uid: ..., 
  structuredTask: ..., // optional
  executionPlan: ..., // optional
  codeChanges: ..., // optional
  validationChecks: ..., // optional
  summary: ..., // optional
  rollbackInstructions: ..., // optional
  modelUsed: ..., // optional
  inputTokens: ..., // optional
  outputTokens: ..., // optional
  costUsd: ..., // optional
  mode: ..., // optional
};

// Call the `createGeneratedCode()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createGeneratedCode(createGeneratedCodeVars);
// Variables can be defined inline as well.
const { data } = await createGeneratedCode({ requestId: ..., uid: ..., structuredTask: ..., executionPlan: ..., codeChanges: ..., validationChecks: ..., summary: ..., rollbackInstructions: ..., modelUsed: ..., inputTokens: ..., outputTokens: ..., costUsd: ..., mode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createGeneratedCode(dataConnect, createGeneratedCodeVars);

console.log(data.generatedCode_insert);

// Or, you can use the `Promise` API.
createGeneratedCode(createGeneratedCodeVars).then((response) => {
  const data = response.data;
  console.log(data.generatedCode_insert);
});
```

### Using `CreateGeneratedCode`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createGeneratedCodeRef, CreateGeneratedCodeVariables } from '@code-helper/dataconnect';

// The `CreateGeneratedCode` mutation requires an argument of type `CreateGeneratedCodeVariables`:
const createGeneratedCodeVars: CreateGeneratedCodeVariables = {
  requestId: ..., 
  uid: ..., 
  structuredTask: ..., // optional
  executionPlan: ..., // optional
  codeChanges: ..., // optional
  validationChecks: ..., // optional
  summary: ..., // optional
  rollbackInstructions: ..., // optional
  modelUsed: ..., // optional
  inputTokens: ..., // optional
  outputTokens: ..., // optional
  costUsd: ..., // optional
  mode: ..., // optional
};

// Call the `createGeneratedCodeRef()` function to get a reference to the mutation.
const ref = createGeneratedCodeRef(createGeneratedCodeVars);
// Variables can be defined inline as well.
const ref = createGeneratedCodeRef({ requestId: ..., uid: ..., structuredTask: ..., executionPlan: ..., codeChanges: ..., validationChecks: ..., summary: ..., rollbackInstructions: ..., modelUsed: ..., inputTokens: ..., outputTokens: ..., costUsd: ..., mode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createGeneratedCodeRef(dataConnect, createGeneratedCodeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.generatedCode_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.generatedCode_insert);
});
```

## CreateServer
You can execute the `CreateServer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createServer(vars: CreateServerVariables): MutationPromise<CreateServerData, CreateServerVariables>;

interface CreateServerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServerVariables): MutationRef<CreateServerData, CreateServerVariables>;
}
export const createServerRef: CreateServerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createServer(dc: DataConnect, vars: CreateServerVariables): MutationPromise<CreateServerData, CreateServerVariables>;

interface CreateServerRef {
  ...
  (dc: DataConnect, vars: CreateServerVariables): MutationRef<CreateServerData, CreateServerVariables>;
}
export const createServerRef: CreateServerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServerRef:
```typescript
const name = createServerRef.operationName;
console.log(name);
```

### Variables
The `CreateServer` mutation requires an argument of type `CreateServerVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateServer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServerData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServerData {
  server_insert: Server_Key;
}
```
### Using `CreateServer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createServer, CreateServerVariables } from '@code-helper/dataconnect';

// The `CreateServer` mutation requires an argument of type `CreateServerVariables`:
const createServerVars: CreateServerVariables = {
  projectId: ..., 
  name: ..., 
  serverType: ..., 
  host: ..., 
  port: ..., 
  username: ..., 
  remotePath: ..., // optional
  description: ..., // optional
  credentialSecretName: ..., // optional
};

// Call the `createServer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createServer(createServerVars);
// Variables can be defined inline as well.
const { data } = await createServer({ projectId: ..., name: ..., serverType: ..., host: ..., port: ..., username: ..., remotePath: ..., description: ..., credentialSecretName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createServer(dataConnect, createServerVars);

console.log(data.server_insert);

// Or, you can use the `Promise` API.
createServer(createServerVars).then((response) => {
  const data = response.data;
  console.log(data.server_insert);
});
```

### Using `CreateServer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServerRef, CreateServerVariables } from '@code-helper/dataconnect';

// The `CreateServer` mutation requires an argument of type `CreateServerVariables`:
const createServerVars: CreateServerVariables = {
  projectId: ..., 
  name: ..., 
  serverType: ..., 
  host: ..., 
  port: ..., 
  username: ..., 
  remotePath: ..., // optional
  description: ..., // optional
  credentialSecretName: ..., // optional
};

// Call the `createServerRef()` function to get a reference to the mutation.
const ref = createServerRef(createServerVars);
// Variables can be defined inline as well.
const ref = createServerRef({ projectId: ..., name: ..., serverType: ..., host: ..., port: ..., username: ..., remotePath: ..., description: ..., credentialSecretName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServerRef(dataConnect, createServerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.server_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.server_insert);
});
```

## UpdateServer
You can execute the `UpdateServer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateServer(vars: UpdateServerVariables): MutationPromise<UpdateServerData, UpdateServerVariables>;

interface UpdateServerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServerVariables): MutationRef<UpdateServerData, UpdateServerVariables>;
}
export const updateServerRef: UpdateServerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateServer(dc: DataConnect, vars: UpdateServerVariables): MutationPromise<UpdateServerData, UpdateServerVariables>;

interface UpdateServerRef {
  ...
  (dc: DataConnect, vars: UpdateServerVariables): MutationRef<UpdateServerData, UpdateServerVariables>;
}
export const updateServerRef: UpdateServerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateServerRef:
```typescript
const name = updateServerRef.operationName;
console.log(name);
```

### Variables
The `UpdateServer` mutation requires an argument of type `UpdateServerVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateServer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateServerData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateServerData {
  server_update?: Server_Key | null;
}
```
### Using `UpdateServer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateServer, UpdateServerVariables } from '@code-helper/dataconnect';

// The `UpdateServer` mutation requires an argument of type `UpdateServerVariables`:
const updateServerVars: UpdateServerVariables = {
  id: ..., 
  name: ..., // optional
  host: ..., // optional
  port: ..., // optional
  username: ..., // optional
  remotePath: ..., // optional
  description: ..., // optional
  credentialSecretName: ..., // optional
};

// Call the `updateServer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateServer(updateServerVars);
// Variables can be defined inline as well.
const { data } = await updateServer({ id: ..., name: ..., host: ..., port: ..., username: ..., remotePath: ..., description: ..., credentialSecretName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateServer(dataConnect, updateServerVars);

console.log(data.server_update);

// Or, you can use the `Promise` API.
updateServer(updateServerVars).then((response) => {
  const data = response.data;
  console.log(data.server_update);
});
```

### Using `UpdateServer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateServerRef, UpdateServerVariables } from '@code-helper/dataconnect';

// The `UpdateServer` mutation requires an argument of type `UpdateServerVariables`:
const updateServerVars: UpdateServerVariables = {
  id: ..., 
  name: ..., // optional
  host: ..., // optional
  port: ..., // optional
  username: ..., // optional
  remotePath: ..., // optional
  description: ..., // optional
  credentialSecretName: ..., // optional
};

// Call the `updateServerRef()` function to get a reference to the mutation.
const ref = updateServerRef(updateServerVars);
// Variables can be defined inline as well.
const ref = updateServerRef({ id: ..., name: ..., host: ..., port: ..., username: ..., remotePath: ..., description: ..., credentialSecretName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateServerRef(dataConnect, updateServerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.server_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.server_update);
});
```

## RecordServerConnection
You can execute the `RecordServerConnection` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
recordServerConnection(vars: RecordServerConnectionVariables): MutationPromise<RecordServerConnectionData, RecordServerConnectionVariables>;

interface RecordServerConnectionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordServerConnectionVariables): MutationRef<RecordServerConnectionData, RecordServerConnectionVariables>;
}
export const recordServerConnectionRef: RecordServerConnectionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordServerConnection(dc: DataConnect, vars: RecordServerConnectionVariables): MutationPromise<RecordServerConnectionData, RecordServerConnectionVariables>;

interface RecordServerConnectionRef {
  ...
  (dc: DataConnect, vars: RecordServerConnectionVariables): MutationRef<RecordServerConnectionData, RecordServerConnectionVariables>;
}
export const recordServerConnectionRef: RecordServerConnectionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordServerConnectionRef:
```typescript
const name = recordServerConnectionRef.operationName;
console.log(name);
```

### Variables
The `RecordServerConnection` mutation requires an argument of type `RecordServerConnectionVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordServerConnectionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `RecordServerConnection` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordServerConnectionData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordServerConnectionData {
  server_update?: Server_Key | null;
}
```
### Using `RecordServerConnection`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordServerConnection, RecordServerConnectionVariables } from '@code-helper/dataconnect';

// The `RecordServerConnection` mutation requires an argument of type `RecordServerConnectionVariables`:
const recordServerConnectionVars: RecordServerConnectionVariables = {
  id: ..., 
};

// Call the `recordServerConnection()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordServerConnection(recordServerConnectionVars);
// Variables can be defined inline as well.
const { data } = await recordServerConnection({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordServerConnection(dataConnect, recordServerConnectionVars);

console.log(data.server_update);

// Or, you can use the `Promise` API.
recordServerConnection(recordServerConnectionVars).then((response) => {
  const data = response.data;
  console.log(data.server_update);
});
```

### Using `RecordServerConnection`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordServerConnectionRef, RecordServerConnectionVariables } from '@code-helper/dataconnect';

// The `RecordServerConnection` mutation requires an argument of type `RecordServerConnectionVariables`:
const recordServerConnectionVars: RecordServerConnectionVariables = {
  id: ..., 
};

// Call the `recordServerConnectionRef()` function to get a reference to the mutation.
const ref = recordServerConnectionRef(recordServerConnectionVars);
// Variables can be defined inline as well.
const ref = recordServerConnectionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordServerConnectionRef(dataConnect, recordServerConnectionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.server_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.server_update);
});
```

## DeleteServer
You can execute the `DeleteServer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteServer(vars: DeleteServerVariables): MutationPromise<DeleteServerData, DeleteServerVariables>;

interface DeleteServerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServerVariables): MutationRef<DeleteServerData, DeleteServerVariables>;
}
export const deleteServerRef: DeleteServerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteServer(dc: DataConnect, vars: DeleteServerVariables): MutationPromise<DeleteServerData, DeleteServerVariables>;

interface DeleteServerRef {
  ...
  (dc: DataConnect, vars: DeleteServerVariables): MutationRef<DeleteServerData, DeleteServerVariables>;
}
export const deleteServerRef: DeleteServerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteServerRef:
```typescript
const name = deleteServerRef.operationName;
console.log(name);
```

### Variables
The `DeleteServer` mutation requires an argument of type `DeleteServerVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteServerVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteServer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteServerData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteServerData {
  server_update?: Server_Key | null;
}
```
### Using `DeleteServer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteServer, DeleteServerVariables } from '@code-helper/dataconnect';

// The `DeleteServer` mutation requires an argument of type `DeleteServerVariables`:
const deleteServerVars: DeleteServerVariables = {
  id: ..., 
};

// Call the `deleteServer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteServer(deleteServerVars);
// Variables can be defined inline as well.
const { data } = await deleteServer({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteServer(dataConnect, deleteServerVars);

console.log(data.server_update);

// Or, you can use the `Promise` API.
deleteServer(deleteServerVars).then((response) => {
  const data = response.data;
  console.log(data.server_update);
});
```

### Using `DeleteServer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteServerRef, DeleteServerVariables } from '@code-helper/dataconnect';

// The `DeleteServer` mutation requires an argument of type `DeleteServerVariables`:
const deleteServerVars: DeleteServerVariables = {
  id: ..., 
};

// Call the `deleteServerRef()` function to get a reference to the mutation.
const ref = deleteServerRef(deleteServerVars);
// Variables can be defined inline as well.
const ref = deleteServerRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteServerRef(dataConnect, deleteServerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.server_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.server_update);
});
```

## CreateDeployLog
You can execute the `CreateDeployLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createDeployLog(vars: CreateDeployLogVariables): MutationPromise<CreateDeployLogData, CreateDeployLogVariables>;

interface CreateDeployLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDeployLogVariables): MutationRef<CreateDeployLogData, CreateDeployLogVariables>;
}
export const createDeployLogRef: CreateDeployLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDeployLog(dc: DataConnect, vars: CreateDeployLogVariables): MutationPromise<CreateDeployLogData, CreateDeployLogVariables>;

interface CreateDeployLogRef {
  ...
  (dc: DataConnect, vars: CreateDeployLogVariables): MutationRef<CreateDeployLogData, CreateDeployLogVariables>;
}
export const createDeployLogRef: CreateDeployLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDeployLogRef:
```typescript
const name = createDeployLogRef.operationName;
console.log(name);
```

### Variables
The `CreateDeployLog` mutation requires an argument of type `CreateDeployLogVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDeployLogVariables {
  serverId: UUIDString;
  projectId: UUIDString;
  uid: string;
  generatedCodeId?: UUIDString | null;
  filesDeployed?: unknown | null;
  status: string;
  errorMessage?: string | null;
}
```
### Return Type
Recall that executing the `CreateDeployLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDeployLogData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDeployLogData {
  deployLog_insert: DeployLog_Key;
}
```
### Using `CreateDeployLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDeployLog, CreateDeployLogVariables } from '@code-helper/dataconnect';

// The `CreateDeployLog` mutation requires an argument of type `CreateDeployLogVariables`:
const createDeployLogVars: CreateDeployLogVariables = {
  serverId: ..., 
  projectId: ..., 
  uid: ..., 
  generatedCodeId: ..., // optional
  filesDeployed: ..., // optional
  status: ..., 
  errorMessage: ..., // optional
};

// Call the `createDeployLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDeployLog(createDeployLogVars);
// Variables can be defined inline as well.
const { data } = await createDeployLog({ serverId: ..., projectId: ..., uid: ..., generatedCodeId: ..., filesDeployed: ..., status: ..., errorMessage: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDeployLog(dataConnect, createDeployLogVars);

console.log(data.deployLog_insert);

// Or, you can use the `Promise` API.
createDeployLog(createDeployLogVars).then((response) => {
  const data = response.data;
  console.log(data.deployLog_insert);
});
```

### Using `CreateDeployLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDeployLogRef, CreateDeployLogVariables } from '@code-helper/dataconnect';

// The `CreateDeployLog` mutation requires an argument of type `CreateDeployLogVariables`:
const createDeployLogVars: CreateDeployLogVariables = {
  serverId: ..., 
  projectId: ..., 
  uid: ..., 
  generatedCodeId: ..., // optional
  filesDeployed: ..., // optional
  status: ..., 
  errorMessage: ..., // optional
};

// Call the `createDeployLogRef()` function to get a reference to the mutation.
const ref = createDeployLogRef(createDeployLogVars);
// Variables can be defined inline as well.
const ref = createDeployLogRef({ serverId: ..., projectId: ..., uid: ..., generatedCodeId: ..., filesDeployed: ..., status: ..., errorMessage: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDeployLogRef(dataConnect, createDeployLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.deployLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.deployLog_insert);
});
```

