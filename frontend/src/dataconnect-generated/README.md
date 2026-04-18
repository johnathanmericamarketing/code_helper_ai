# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*ListProjectsForUser*](#listprojectsforuser)
  - [*ListCodeRequests*](#listcoderequests)
  - [*GetGeneratedCodeForRequest*](#getgeneratedcodeforrequest)
  - [*ListKnowledgeBase*](#listknowledgebase)
  - [*ListServers*](#listservers)
  - [*ListGitHubConnections*](#listgithubconnections)
  - [*ListWorkspaces*](#listworkspaces)
- [**Mutations**](#mutations)
  - [*UpsertUser*](#upsertuser)
  - [*CreateProject*](#createproject)
  - [*UpdateProject*](#updateproject)
  - [*DeleteProject*](#deleteproject)
  - [*CreateCodeRequest*](#createcoderequest)
  - [*UpdateCodeRequestStatus*](#updatecoderequeststatus)
  - [*CreateKnowledgeBase*](#createknowledgebase)
  - [*DeleteKnowledgeBase*](#deleteknowledgebase)
  - [*CreateWorkspace*](#createworkspace)
  - [*DeleteWorkspace*](#deleteworkspace)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/default` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/default';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/default';

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

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
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

The `data` property is an object of type `GetCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@dataconnect/default';


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
import { connectorConfig, getCurrentUserRef } from '@dataconnect/default';


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

## ListProjectsForUser
You can execute the `ListProjectsForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProjectsForUser(options?: ExecuteQueryOptions): QueryPromise<ListProjectsForUserData, undefined>;

interface ListProjectsForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProjectsForUserData, undefined>;
}
export const listProjectsForUserRef: ListProjectsForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProjectsForUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProjectsForUserData, undefined>;

interface ListProjectsForUserRef {
  ...
  (dc: DataConnect): QueryRef<ListProjectsForUserData, undefined>;
}
export const listProjectsForUserRef: ListProjectsForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProjectsForUserRef:
```typescript
const name = listProjectsForUserRef.operationName;
console.log(name);
```

### Variables
The `ListProjectsForUser` query has no variables.
### Return Type
Recall that executing the `ListProjectsForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProjectsForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListProjectsForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProjectsForUser } from '@dataconnect/default';


// Call the `listProjectsForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProjectsForUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProjectsForUser(dataConnect);

console.log(data.projects);

// Or, you can use the `Promise` API.
listProjectsForUser().then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

### Using `ListProjectsForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProjectsForUserRef } from '@dataconnect/default';


// Call the `listProjectsForUserRef()` function to get a reference to the query.
const ref = listProjectsForUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProjectsForUserRef(dataConnect);

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

## ListCodeRequests
You can execute the `ListCodeRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCodeRequests(vars?: ListCodeRequestsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCodeRequestsData, ListCodeRequestsVariables>;

interface ListCodeRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListCodeRequestsVariables): QueryRef<ListCodeRequestsData, ListCodeRequestsVariables>;
}
export const listCodeRequestsRef: ListCodeRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCodeRequests(dc: DataConnect, vars?: ListCodeRequestsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCodeRequestsData, ListCodeRequestsVariables>;

interface ListCodeRequestsRef {
  ...
  (dc: DataConnect, vars?: ListCodeRequestsVariables): QueryRef<ListCodeRequestsData, ListCodeRequestsVariables>;
}
export const listCodeRequestsRef: ListCodeRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCodeRequestsRef:
```typescript
const name = listCodeRequestsRef.operationName;
console.log(name);
```

### Variables
The `ListCodeRequests` query has an optional argument of type `ListCodeRequestsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCodeRequestsVariables {
  projectId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `ListCodeRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCodeRequestsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListCodeRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCodeRequests, ListCodeRequestsVariables } from '@dataconnect/default';

// The `ListCodeRequests` query has an optional argument of type `ListCodeRequestsVariables`:
const listCodeRequestsVars: ListCodeRequestsVariables = {
  projectId: ..., // optional
};

// Call the `listCodeRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCodeRequests(listCodeRequestsVars);
// Variables can be defined inline as well.
const { data } = await listCodeRequests({ projectId: ..., });
// Since all variables are optional for this query, you can omit the `ListCodeRequestsVariables` argument.
const { data } = await listCodeRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCodeRequests(dataConnect, listCodeRequestsVars);

console.log(data.codeRequests);

// Or, you can use the `Promise` API.
listCodeRequests(listCodeRequestsVars).then((response) => {
  const data = response.data;
  console.log(data.codeRequests);
});
```

### Using `ListCodeRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCodeRequestsRef, ListCodeRequestsVariables } from '@dataconnect/default';

// The `ListCodeRequests` query has an optional argument of type `ListCodeRequestsVariables`:
const listCodeRequestsVars: ListCodeRequestsVariables = {
  projectId: ..., // optional
};

// Call the `listCodeRequestsRef()` function to get a reference to the query.
const ref = listCodeRequestsRef(listCodeRequestsVars);
// Variables can be defined inline as well.
const ref = listCodeRequestsRef({ projectId: ..., });
// Since all variables are optional for this query, you can omit the `ListCodeRequestsVariables` argument.
const ref = listCodeRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCodeRequestsRef(dataConnect, listCodeRequestsVars);

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

## GetGeneratedCodeForRequest
You can execute the `GetGeneratedCodeForRequest` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getGeneratedCodeForRequest(vars: GetGeneratedCodeForRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetGeneratedCodeForRequestData, GetGeneratedCodeForRequestVariables>;

interface GetGeneratedCodeForRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGeneratedCodeForRequestVariables): QueryRef<GetGeneratedCodeForRequestData, GetGeneratedCodeForRequestVariables>;
}
export const getGeneratedCodeForRequestRef: GetGeneratedCodeForRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGeneratedCodeForRequest(dc: DataConnect, vars: GetGeneratedCodeForRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetGeneratedCodeForRequestData, GetGeneratedCodeForRequestVariables>;

interface GetGeneratedCodeForRequestRef {
  ...
  (dc: DataConnect, vars: GetGeneratedCodeForRequestVariables): QueryRef<GetGeneratedCodeForRequestData, GetGeneratedCodeForRequestVariables>;
}
export const getGeneratedCodeForRequestRef: GetGeneratedCodeForRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGeneratedCodeForRequestRef:
```typescript
const name = getGeneratedCodeForRequestRef.operationName;
console.log(name);
```

### Variables
The `GetGeneratedCodeForRequest` query requires an argument of type `GetGeneratedCodeForRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetGeneratedCodeForRequestVariables {
  requestId: UUIDString;
}
```
### Return Type
Recall that executing the `GetGeneratedCodeForRequest` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGeneratedCodeForRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetGeneratedCodeForRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGeneratedCodeForRequest, GetGeneratedCodeForRequestVariables } from '@dataconnect/default';

// The `GetGeneratedCodeForRequest` query requires an argument of type `GetGeneratedCodeForRequestVariables`:
const getGeneratedCodeForRequestVars: GetGeneratedCodeForRequestVariables = {
  requestId: ..., 
};

// Call the `getGeneratedCodeForRequest()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGeneratedCodeForRequest(getGeneratedCodeForRequestVars);
// Variables can be defined inline as well.
const { data } = await getGeneratedCodeForRequest({ requestId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGeneratedCodeForRequest(dataConnect, getGeneratedCodeForRequestVars);

console.log(data.generatedCodes);

// Or, you can use the `Promise` API.
getGeneratedCodeForRequest(getGeneratedCodeForRequestVars).then((response) => {
  const data = response.data;
  console.log(data.generatedCodes);
});
```

### Using `GetGeneratedCodeForRequest`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGeneratedCodeForRequestRef, GetGeneratedCodeForRequestVariables } from '@dataconnect/default';

// The `GetGeneratedCodeForRequest` query requires an argument of type `GetGeneratedCodeForRequestVariables`:
const getGeneratedCodeForRequestVars: GetGeneratedCodeForRequestVariables = {
  requestId: ..., 
};

// Call the `getGeneratedCodeForRequestRef()` function to get a reference to the query.
const ref = getGeneratedCodeForRequestRef(getGeneratedCodeForRequestVars);
// Variables can be defined inline as well.
const ref = getGeneratedCodeForRequestRef({ requestId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGeneratedCodeForRequestRef(dataConnect, getGeneratedCodeForRequestVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.generatedCodes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.generatedCodes);
});
```

## ListKnowledgeBase
You can execute the `ListKnowledgeBase` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listKnowledgeBase(vars?: ListKnowledgeBaseVariables, options?: ExecuteQueryOptions): QueryPromise<ListKnowledgeBaseData, ListKnowledgeBaseVariables>;

interface ListKnowledgeBaseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListKnowledgeBaseVariables): QueryRef<ListKnowledgeBaseData, ListKnowledgeBaseVariables>;
}
export const listKnowledgeBaseRef: ListKnowledgeBaseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listKnowledgeBase(dc: DataConnect, vars?: ListKnowledgeBaseVariables, options?: ExecuteQueryOptions): QueryPromise<ListKnowledgeBaseData, ListKnowledgeBaseVariables>;

interface ListKnowledgeBaseRef {
  ...
  (dc: DataConnect, vars?: ListKnowledgeBaseVariables): QueryRef<ListKnowledgeBaseData, ListKnowledgeBaseVariables>;
}
export const listKnowledgeBaseRef: ListKnowledgeBaseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listKnowledgeBaseRef:
```typescript
const name = listKnowledgeBaseRef.operationName;
console.log(name);
```

### Variables
The `ListKnowledgeBase` query has an optional argument of type `ListKnowledgeBaseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListKnowledgeBaseVariables {
  projectId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `ListKnowledgeBase` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListKnowledgeBaseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListKnowledgeBase`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listKnowledgeBase, ListKnowledgeBaseVariables } from '@dataconnect/default';

// The `ListKnowledgeBase` query has an optional argument of type `ListKnowledgeBaseVariables`:
const listKnowledgeBaseVars: ListKnowledgeBaseVariables = {
  projectId: ..., // optional
};

// Call the `listKnowledgeBase()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listKnowledgeBase(listKnowledgeBaseVars);
// Variables can be defined inline as well.
const { data } = await listKnowledgeBase({ projectId: ..., });
// Since all variables are optional for this query, you can omit the `ListKnowledgeBaseVariables` argument.
const { data } = await listKnowledgeBase();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listKnowledgeBase(dataConnect, listKnowledgeBaseVars);

console.log(data.knowledgeBases);

// Or, you can use the `Promise` API.
listKnowledgeBase(listKnowledgeBaseVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeBases);
});
```

### Using `ListKnowledgeBase`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listKnowledgeBaseRef, ListKnowledgeBaseVariables } from '@dataconnect/default';

// The `ListKnowledgeBase` query has an optional argument of type `ListKnowledgeBaseVariables`:
const listKnowledgeBaseVars: ListKnowledgeBaseVariables = {
  projectId: ..., // optional
};

// Call the `listKnowledgeBaseRef()` function to get a reference to the query.
const ref = listKnowledgeBaseRef(listKnowledgeBaseVars);
// Variables can be defined inline as well.
const ref = listKnowledgeBaseRef({ projectId: ..., });
// Since all variables are optional for this query, you can omit the `ListKnowledgeBaseVariables` argument.
const ref = listKnowledgeBaseRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listKnowledgeBaseRef(dataConnect, listKnowledgeBaseVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.knowledgeBases);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeBases);
});
```

## ListServers
You can execute the `ListServers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listServers(options?: ExecuteQueryOptions): QueryPromise<ListServersData, undefined>;

interface ListServersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListServersData, undefined>;
}
export const listServersRef: ListServersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listServers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListServersData, undefined>;

interface ListServersRef {
  ...
  (dc: DataConnect): QueryRef<ListServersData, undefined>;
}
export const listServersRef: ListServersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listServersRef:
```typescript
const name = listServersRef.operationName;
console.log(name);
```

### Variables
The `ListServers` query has no variables.
### Return Type
Recall that executing the `ListServers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListServersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListServers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listServers } from '@dataconnect/default';


// Call the `listServers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listServers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listServers(dataConnect);

console.log(data.servers);

// Or, you can use the `Promise` API.
listServers().then((response) => {
  const data = response.data;
  console.log(data.servers);
});
```

### Using `ListServers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listServersRef } from '@dataconnect/default';


// Call the `listServersRef()` function to get a reference to the query.
const ref = listServersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listServersRef(dataConnect);

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

## ListGitHubConnections
You can execute the `ListGitHubConnections` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listGitHubConnections(options?: ExecuteQueryOptions): QueryPromise<ListGitHubConnectionsData, undefined>;

interface ListGitHubConnectionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListGitHubConnectionsData, undefined>;
}
export const listGitHubConnectionsRef: ListGitHubConnectionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listGitHubConnections(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListGitHubConnectionsData, undefined>;

interface ListGitHubConnectionsRef {
  ...
  (dc: DataConnect): QueryRef<ListGitHubConnectionsData, undefined>;
}
export const listGitHubConnectionsRef: ListGitHubConnectionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listGitHubConnectionsRef:
```typescript
const name = listGitHubConnectionsRef.operationName;
console.log(name);
```

### Variables
The `ListGitHubConnections` query has no variables.
### Return Type
Recall that executing the `ListGitHubConnections` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListGitHubConnectionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListGitHubConnections`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listGitHubConnections } from '@dataconnect/default';


// Call the `listGitHubConnections()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listGitHubConnections();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listGitHubConnections(dataConnect);

console.log(data.gitHubConnections);

// Or, you can use the `Promise` API.
listGitHubConnections().then((response) => {
  const data = response.data;
  console.log(data.gitHubConnections);
});
```

### Using `ListGitHubConnections`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listGitHubConnectionsRef } from '@dataconnect/default';


// Call the `listGitHubConnectionsRef()` function to get a reference to the query.
const ref = listGitHubConnectionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listGitHubConnectionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.gitHubConnections);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.gitHubConnections);
});
```

## ListWorkspaces
You can execute the `ListWorkspaces` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listWorkspaces(options?: ExecuteQueryOptions): QueryPromise<ListWorkspacesData, undefined>;

interface ListWorkspacesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListWorkspacesData, undefined>;
}
export const listWorkspacesRef: ListWorkspacesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listWorkspaces(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListWorkspacesData, undefined>;

interface ListWorkspacesRef {
  ...
  (dc: DataConnect): QueryRef<ListWorkspacesData, undefined>;
}
export const listWorkspacesRef: ListWorkspacesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listWorkspacesRef:
```typescript
const name = listWorkspacesRef.operationName;
console.log(name);
```

### Variables
The `ListWorkspaces` query has no variables.
### Return Type
Recall that executing the `ListWorkspaces` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListWorkspacesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListWorkspaces`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listWorkspaces } from '@dataconnect/default';


// Call the `listWorkspaces()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listWorkspaces();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listWorkspaces(dataConnect);

console.log(data.workspaces);

// Or, you can use the `Promise` API.
listWorkspaces().then((response) => {
  const data = response.data;
  console.log(data.workspaces);
});
```

### Using `ListWorkspaces`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listWorkspacesRef } from '@dataconnect/default';


// Call the `listWorkspacesRef()` function to get a reference to the query.
const ref = listWorkspacesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listWorkspacesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workspaces);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workspaces);
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

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
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
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string | null;
  plan: string;
  role: string;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@dataconnect/default';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  username: ..., 
  email: ..., 
  passwordHash: ..., 
  displayName: ..., // optional
  plan: ..., 
  role: ..., 
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ username: ..., email: ..., passwordHash: ..., displayName: ..., plan: ..., role: ..., });

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
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@dataconnect/default';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  username: ..., 
  email: ..., 
  passwordHash: ..., 
  displayName: ..., // optional
  plan: ..., 
  role: ..., 
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ username: ..., email: ..., passwordHash: ..., displayName: ..., plan: ..., role: ..., });

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

## CreateProject
You can execute the `CreateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
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
The `CreateProject` mutation requires an argument of type `CreateProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProjectVariables {
  name: string;
  description?: string | null;
  domain?: string | null;
  repositoryUrl?: string | null;
  techStack?: string[] | null;
}
```
### Return Type
Recall that executing the `CreateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProjectData {
  project_insert: Project_Key;
}
```
### Using `CreateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProject, CreateProjectVariables } from '@dataconnect/default';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  name: ..., 
  description: ..., // optional
  domain: ..., // optional
  repositoryUrl: ..., // optional
  techStack: ..., // optional
};

// Call the `createProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProject(createProjectVars);
// Variables can be defined inline as well.
const { data } = await createProject({ name: ..., description: ..., domain: ..., repositoryUrl: ..., techStack: ..., });

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
import { connectorConfig, createProjectRef, CreateProjectVariables } from '@dataconnect/default';

// The `CreateProject` mutation requires an argument of type `CreateProjectVariables`:
const createProjectVars: CreateProjectVariables = {
  name: ..., 
  description: ..., // optional
  domain: ..., // optional
  repositoryUrl: ..., // optional
  techStack: ..., // optional
};

// Call the `createProjectRef()` function to get a reference to the mutation.
const ref = createProjectRef(createProjectVars);
// Variables can be defined inline as well.
const ref = createProjectRef({ name: ..., description: ..., domain: ..., repositoryUrl: ..., techStack: ..., });

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
You can execute the `UpdateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
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
The `UpdateProject` mutation requires an argument of type `UpdateProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProjectVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  domain?: string | null;
  repositoryUrl?: string | null;
  techStack?: string[] | null;
}
```
### Return Type
Recall that executing the `UpdateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProjectData {
  project_updateMany: number;
}
```
### Using `UpdateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProject, UpdateProjectVariables } from '@dataconnect/default';

// The `UpdateProject` mutation requires an argument of type `UpdateProjectVariables`:
const updateProjectVars: UpdateProjectVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  domain: ..., // optional
  repositoryUrl: ..., // optional
  techStack: ..., // optional
};

// Call the `updateProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProject(updateProjectVars);
// Variables can be defined inline as well.
const { data } = await updateProject({ id: ..., name: ..., description: ..., domain: ..., repositoryUrl: ..., techStack: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProject(dataConnect, updateProjectVars);

console.log(data.project_updateMany);

// Or, you can use the `Promise` API.
updateProject(updateProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_updateMany);
});
```

### Using `UpdateProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProjectRef, UpdateProjectVariables } from '@dataconnect/default';

// The `UpdateProject` mutation requires an argument of type `UpdateProjectVariables`:
const updateProjectVars: UpdateProjectVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  domain: ..., // optional
  repositoryUrl: ..., // optional
  techStack: ..., // optional
};

// Call the `updateProjectRef()` function to get a reference to the mutation.
const ref = updateProjectRef(updateProjectVars);
// Variables can be defined inline as well.
const ref = updateProjectRef({ id: ..., name: ..., description: ..., domain: ..., repositoryUrl: ..., techStack: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProjectRef(dataConnect, updateProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_updateMany);
});
```

## DeleteProject
You can execute the `DeleteProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteProject(vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;

interface DeleteProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
}
export const deleteProjectRef: DeleteProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProject(dc: DataConnect, vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;

interface DeleteProjectRef {
  ...
  (dc: DataConnect, vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
}
export const deleteProjectRef: DeleteProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProjectRef:
```typescript
const name = deleteProjectRef.operationName;
console.log(name);
```

### Variables
The `DeleteProject` mutation requires an argument of type `DeleteProjectVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProjectVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProjectData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProjectData {
  project_deleteMany: number;
}
```
### Using `DeleteProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProject, DeleteProjectVariables } from '@dataconnect/default';

// The `DeleteProject` mutation requires an argument of type `DeleteProjectVariables`:
const deleteProjectVars: DeleteProjectVariables = {
  id: ..., 
};

// Call the `deleteProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProject(deleteProjectVars);
// Variables can be defined inline as well.
const { data } = await deleteProject({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProject(dataConnect, deleteProjectVars);

console.log(data.project_deleteMany);

// Or, you can use the `Promise` API.
deleteProject(deleteProjectVars).then((response) => {
  const data = response.data;
  console.log(data.project_deleteMany);
});
```

### Using `DeleteProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProjectRef, DeleteProjectVariables } from '@dataconnect/default';

// The `DeleteProject` mutation requires an argument of type `DeleteProjectVariables`:
const deleteProjectVars: DeleteProjectVariables = {
  id: ..., 
};

// Call the `deleteProjectRef()` function to get a reference to the mutation.
const ref = deleteProjectRef(deleteProjectVars);
// Variables can be defined inline as well.
const ref = deleteProjectRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProjectRef(dataConnect, deleteProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.project_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.project_deleteMany);
});
```

## CreateCodeRequest
You can execute the `CreateCodeRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
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
The `CreateCodeRequest` mutation requires an argument of type `CreateCodeRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCodeRequestVariables {
  projectId?: UUIDString | null;
  rawRequest: string;
  urgency?: string | null;
  areaOfApp?: string | null;
}
```
### Return Type
Recall that executing the `CreateCodeRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCodeRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCodeRequestData {
  codeRequest_insert: CodeRequest_Key;
}
```
### Using `CreateCodeRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCodeRequest, CreateCodeRequestVariables } from '@dataconnect/default';

// The `CreateCodeRequest` mutation requires an argument of type `CreateCodeRequestVariables`:
const createCodeRequestVars: CreateCodeRequestVariables = {
  projectId: ..., // optional
  rawRequest: ..., 
  urgency: ..., // optional
  areaOfApp: ..., // optional
};

// Call the `createCodeRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCodeRequest(createCodeRequestVars);
// Variables can be defined inline as well.
const { data } = await createCodeRequest({ projectId: ..., rawRequest: ..., urgency: ..., areaOfApp: ..., });

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
import { connectorConfig, createCodeRequestRef, CreateCodeRequestVariables } from '@dataconnect/default';

// The `CreateCodeRequest` mutation requires an argument of type `CreateCodeRequestVariables`:
const createCodeRequestVars: CreateCodeRequestVariables = {
  projectId: ..., // optional
  rawRequest: ..., 
  urgency: ..., // optional
  areaOfApp: ..., // optional
};

// Call the `createCodeRequestRef()` function to get a reference to the mutation.
const ref = createCodeRequestRef(createCodeRequestVars);
// Variables can be defined inline as well.
const ref = createCodeRequestRef({ projectId: ..., rawRequest: ..., urgency: ..., areaOfApp: ..., });

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
You can execute the `UpdateCodeRequestStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
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
The `UpdateCodeRequestStatus` mutation requires an argument of type `UpdateCodeRequestStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCodeRequestStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateCodeRequestStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCodeRequestStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCodeRequestStatusData {
  codeRequest_updateMany: number;
}
```
### Using `UpdateCodeRequestStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCodeRequestStatus, UpdateCodeRequestStatusVariables } from '@dataconnect/default';

// The `UpdateCodeRequestStatus` mutation requires an argument of type `UpdateCodeRequestStatusVariables`:
const updateCodeRequestStatusVars: UpdateCodeRequestStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateCodeRequestStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCodeRequestStatus(updateCodeRequestStatusVars);
// Variables can be defined inline as well.
const { data } = await updateCodeRequestStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCodeRequestStatus(dataConnect, updateCodeRequestStatusVars);

console.log(data.codeRequest_updateMany);

// Or, you can use the `Promise` API.
updateCodeRequestStatus(updateCodeRequestStatusVars).then((response) => {
  const data = response.data;
  console.log(data.codeRequest_updateMany);
});
```

### Using `UpdateCodeRequestStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCodeRequestStatusRef, UpdateCodeRequestStatusVariables } from '@dataconnect/default';

// The `UpdateCodeRequestStatus` mutation requires an argument of type `UpdateCodeRequestStatusVariables`:
const updateCodeRequestStatusVars: UpdateCodeRequestStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateCodeRequestStatusRef()` function to get a reference to the mutation.
const ref = updateCodeRequestStatusRef(updateCodeRequestStatusVars);
// Variables can be defined inline as well.
const ref = updateCodeRequestStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCodeRequestStatusRef(dataConnect, updateCodeRequestStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.codeRequest_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.codeRequest_updateMany);
});
```

## CreateKnowledgeBase
You can execute the `CreateKnowledgeBase` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createKnowledgeBase(vars: CreateKnowledgeBaseVariables): MutationPromise<CreateKnowledgeBaseData, CreateKnowledgeBaseVariables>;

interface CreateKnowledgeBaseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateKnowledgeBaseVariables): MutationRef<CreateKnowledgeBaseData, CreateKnowledgeBaseVariables>;
}
export const createKnowledgeBaseRef: CreateKnowledgeBaseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createKnowledgeBase(dc: DataConnect, vars: CreateKnowledgeBaseVariables): MutationPromise<CreateKnowledgeBaseData, CreateKnowledgeBaseVariables>;

interface CreateKnowledgeBaseRef {
  ...
  (dc: DataConnect, vars: CreateKnowledgeBaseVariables): MutationRef<CreateKnowledgeBaseData, CreateKnowledgeBaseVariables>;
}
export const createKnowledgeBaseRef: CreateKnowledgeBaseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createKnowledgeBaseRef:
```typescript
const name = createKnowledgeBaseRef.operationName;
console.log(name);
```

### Variables
The `CreateKnowledgeBase` mutation requires an argument of type `CreateKnowledgeBaseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateKnowledgeBase` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateKnowledgeBaseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateKnowledgeBaseData {
  knowledgeBase_insert: KnowledgeBase_Key;
}
```
### Using `CreateKnowledgeBase`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createKnowledgeBase, CreateKnowledgeBaseVariables } from '@dataconnect/default';

// The `CreateKnowledgeBase` mutation requires an argument of type `CreateKnowledgeBaseVariables`:
const createKnowledgeBaseVars: CreateKnowledgeBaseVariables = {
  projectId: ..., // optional
  title: ..., 
  category: ..., 
  description: ..., 
  priority: ..., 
  language: ..., // optional
  framework: ..., // optional
  codeExample: ..., // optional
  badExample: ..., // optional
};

// Call the `createKnowledgeBase()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createKnowledgeBase(createKnowledgeBaseVars);
// Variables can be defined inline as well.
const { data } = await createKnowledgeBase({ projectId: ..., title: ..., category: ..., description: ..., priority: ..., language: ..., framework: ..., codeExample: ..., badExample: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createKnowledgeBase(dataConnect, createKnowledgeBaseVars);

console.log(data.knowledgeBase_insert);

// Or, you can use the `Promise` API.
createKnowledgeBase(createKnowledgeBaseVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeBase_insert);
});
```

### Using `CreateKnowledgeBase`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createKnowledgeBaseRef, CreateKnowledgeBaseVariables } from '@dataconnect/default';

// The `CreateKnowledgeBase` mutation requires an argument of type `CreateKnowledgeBaseVariables`:
const createKnowledgeBaseVars: CreateKnowledgeBaseVariables = {
  projectId: ..., // optional
  title: ..., 
  category: ..., 
  description: ..., 
  priority: ..., 
  language: ..., // optional
  framework: ..., // optional
  codeExample: ..., // optional
  badExample: ..., // optional
};

// Call the `createKnowledgeBaseRef()` function to get a reference to the mutation.
const ref = createKnowledgeBaseRef(createKnowledgeBaseVars);
// Variables can be defined inline as well.
const ref = createKnowledgeBaseRef({ projectId: ..., title: ..., category: ..., description: ..., priority: ..., language: ..., framework: ..., codeExample: ..., badExample: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createKnowledgeBaseRef(dataConnect, createKnowledgeBaseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.knowledgeBase_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeBase_insert);
});
```

## DeleteKnowledgeBase
You can execute the `DeleteKnowledgeBase` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteKnowledgeBase(vars: DeleteKnowledgeBaseVariables): MutationPromise<DeleteKnowledgeBaseData, DeleteKnowledgeBaseVariables>;

interface DeleteKnowledgeBaseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteKnowledgeBaseVariables): MutationRef<DeleteKnowledgeBaseData, DeleteKnowledgeBaseVariables>;
}
export const deleteKnowledgeBaseRef: DeleteKnowledgeBaseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteKnowledgeBase(dc: DataConnect, vars: DeleteKnowledgeBaseVariables): MutationPromise<DeleteKnowledgeBaseData, DeleteKnowledgeBaseVariables>;

interface DeleteKnowledgeBaseRef {
  ...
  (dc: DataConnect, vars: DeleteKnowledgeBaseVariables): MutationRef<DeleteKnowledgeBaseData, DeleteKnowledgeBaseVariables>;
}
export const deleteKnowledgeBaseRef: DeleteKnowledgeBaseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteKnowledgeBaseRef:
```typescript
const name = deleteKnowledgeBaseRef.operationName;
console.log(name);
```

### Variables
The `DeleteKnowledgeBase` mutation requires an argument of type `DeleteKnowledgeBaseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteKnowledgeBaseVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteKnowledgeBase` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteKnowledgeBaseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteKnowledgeBaseData {
  knowledgeBase_deleteMany: number;
}
```
### Using `DeleteKnowledgeBase`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteKnowledgeBase, DeleteKnowledgeBaseVariables } from '@dataconnect/default';

// The `DeleteKnowledgeBase` mutation requires an argument of type `DeleteKnowledgeBaseVariables`:
const deleteKnowledgeBaseVars: DeleteKnowledgeBaseVariables = {
  id: ..., 
};

// Call the `deleteKnowledgeBase()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteKnowledgeBase(deleteKnowledgeBaseVars);
// Variables can be defined inline as well.
const { data } = await deleteKnowledgeBase({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteKnowledgeBase(dataConnect, deleteKnowledgeBaseVars);

console.log(data.knowledgeBase_deleteMany);

// Or, you can use the `Promise` API.
deleteKnowledgeBase(deleteKnowledgeBaseVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeBase_deleteMany);
});
```

### Using `DeleteKnowledgeBase`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteKnowledgeBaseRef, DeleteKnowledgeBaseVariables } from '@dataconnect/default';

// The `DeleteKnowledgeBase` mutation requires an argument of type `DeleteKnowledgeBaseVariables`:
const deleteKnowledgeBaseVars: DeleteKnowledgeBaseVariables = {
  id: ..., 
};

// Call the `deleteKnowledgeBaseRef()` function to get a reference to the mutation.
const ref = deleteKnowledgeBaseRef(deleteKnowledgeBaseVars);
// Variables can be defined inline as well.
const ref = deleteKnowledgeBaseRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteKnowledgeBaseRef(dataConnect, deleteKnowledgeBaseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.knowledgeBase_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeBase_deleteMany);
});
```

## CreateWorkspace
You can execute the `CreateWorkspace` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createWorkspace(vars: CreateWorkspaceVariables): MutationPromise<CreateWorkspaceData, CreateWorkspaceVariables>;

interface CreateWorkspaceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkspaceVariables): MutationRef<CreateWorkspaceData, CreateWorkspaceVariables>;
}
export const createWorkspaceRef: CreateWorkspaceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createWorkspace(dc: DataConnect, vars: CreateWorkspaceVariables): MutationPromise<CreateWorkspaceData, CreateWorkspaceVariables>;

interface CreateWorkspaceRef {
  ...
  (dc: DataConnect, vars: CreateWorkspaceVariables): MutationRef<CreateWorkspaceData, CreateWorkspaceVariables>;
}
export const createWorkspaceRef: CreateWorkspaceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createWorkspaceRef:
```typescript
const name = createWorkspaceRef.operationName;
console.log(name);
```

### Variables
The `CreateWorkspace` mutation requires an argument of type `CreateWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateWorkspaceVariables {
  name: string;
  path: string;
  description?: string | null;
  isGitRepo: boolean;
}
```
### Return Type
Recall that executing the `CreateWorkspace` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateWorkspaceData {
  workspace_insert: Workspace_Key;
}
```
### Using `CreateWorkspace`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createWorkspace, CreateWorkspaceVariables } from '@dataconnect/default';

// The `CreateWorkspace` mutation requires an argument of type `CreateWorkspaceVariables`:
const createWorkspaceVars: CreateWorkspaceVariables = {
  name: ..., 
  path: ..., 
  description: ..., // optional
  isGitRepo: ..., 
};

// Call the `createWorkspace()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWorkspace(createWorkspaceVars);
// Variables can be defined inline as well.
const { data } = await createWorkspace({ name: ..., path: ..., description: ..., isGitRepo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createWorkspace(dataConnect, createWorkspaceVars);

console.log(data.workspace_insert);

// Or, you can use the `Promise` API.
createWorkspace(createWorkspaceVars).then((response) => {
  const data = response.data;
  console.log(data.workspace_insert);
});
```

### Using `CreateWorkspace`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createWorkspaceRef, CreateWorkspaceVariables } from '@dataconnect/default';

// The `CreateWorkspace` mutation requires an argument of type `CreateWorkspaceVariables`:
const createWorkspaceVars: CreateWorkspaceVariables = {
  name: ..., 
  path: ..., 
  description: ..., // optional
  isGitRepo: ..., 
};

// Call the `createWorkspaceRef()` function to get a reference to the mutation.
const ref = createWorkspaceRef(createWorkspaceVars);
// Variables can be defined inline as well.
const ref = createWorkspaceRef({ name: ..., path: ..., description: ..., isGitRepo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createWorkspaceRef(dataConnect, createWorkspaceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workspace_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workspace_insert);
});
```

## DeleteWorkspace
You can execute the `DeleteWorkspace` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteWorkspace(vars: DeleteWorkspaceVariables): MutationPromise<DeleteWorkspaceData, DeleteWorkspaceVariables>;

interface DeleteWorkspaceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteWorkspaceVariables): MutationRef<DeleteWorkspaceData, DeleteWorkspaceVariables>;
}
export const deleteWorkspaceRef: DeleteWorkspaceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteWorkspace(dc: DataConnect, vars: DeleteWorkspaceVariables): MutationPromise<DeleteWorkspaceData, DeleteWorkspaceVariables>;

interface DeleteWorkspaceRef {
  ...
  (dc: DataConnect, vars: DeleteWorkspaceVariables): MutationRef<DeleteWorkspaceData, DeleteWorkspaceVariables>;
}
export const deleteWorkspaceRef: DeleteWorkspaceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteWorkspaceRef:
```typescript
const name = deleteWorkspaceRef.operationName;
console.log(name);
```

### Variables
The `DeleteWorkspace` mutation requires an argument of type `DeleteWorkspaceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteWorkspaceVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteWorkspace` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteWorkspaceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteWorkspaceData {
  workspace_deleteMany: number;
}
```
### Using `DeleteWorkspace`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteWorkspace, DeleteWorkspaceVariables } from '@dataconnect/default';

// The `DeleteWorkspace` mutation requires an argument of type `DeleteWorkspaceVariables`:
const deleteWorkspaceVars: DeleteWorkspaceVariables = {
  id: ..., 
};

// Call the `deleteWorkspace()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteWorkspace(deleteWorkspaceVars);
// Variables can be defined inline as well.
const { data } = await deleteWorkspace({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteWorkspace(dataConnect, deleteWorkspaceVars);

console.log(data.workspace_deleteMany);

// Or, you can use the `Promise` API.
deleteWorkspace(deleteWorkspaceVars).then((response) => {
  const data = response.data;
  console.log(data.workspace_deleteMany);
});
```

### Using `DeleteWorkspace`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteWorkspaceRef, DeleteWorkspaceVariables } from '@dataconnect/default';

// The `DeleteWorkspace` mutation requires an argument of type `DeleteWorkspaceVariables`:
const deleteWorkspaceVars: DeleteWorkspaceVariables = {
  id: ..., 
};

// Call the `deleteWorkspaceRef()` function to get a reference to the mutation.
const ref = deleteWorkspaceRef(deleteWorkspaceVars);
// Variables can be defined inline as well.
const ref = deleteWorkspaceRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteWorkspaceRef(dataConnect, deleteWorkspaceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workspace_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workspace_deleteMany);
});
```

