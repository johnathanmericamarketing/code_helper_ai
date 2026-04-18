# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUser, createProject, updateProject, deleteProject, createCodeRequest, updateCodeRequestStatus, createKnowledgeBase, deleteKnowledgeBase, createWorkspace, deleteWorkspace } from '@dataconnect/default';


// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation CreateProject:  For variables, look at type CreateProjectVars in ../index.d.ts
const { data } = await CreateProject(dataConnect, createProjectVars);

// Operation UpdateProject:  For variables, look at type UpdateProjectVars in ../index.d.ts
const { data } = await UpdateProject(dataConnect, updateProjectVars);

// Operation DeleteProject:  For variables, look at type DeleteProjectVars in ../index.d.ts
const { data } = await DeleteProject(dataConnect, deleteProjectVars);

// Operation CreateCodeRequest:  For variables, look at type CreateCodeRequestVars in ../index.d.ts
const { data } = await CreateCodeRequest(dataConnect, createCodeRequestVars);

// Operation UpdateCodeRequestStatus:  For variables, look at type UpdateCodeRequestStatusVars in ../index.d.ts
const { data } = await UpdateCodeRequestStatus(dataConnect, updateCodeRequestStatusVars);

// Operation CreateKnowledgeBase:  For variables, look at type CreateKnowledgeBaseVars in ../index.d.ts
const { data } = await CreateKnowledgeBase(dataConnect, createKnowledgeBaseVars);

// Operation DeleteKnowledgeBase:  For variables, look at type DeleteKnowledgeBaseVars in ../index.d.ts
const { data } = await DeleteKnowledgeBase(dataConnect, deleteKnowledgeBaseVars);

// Operation CreateWorkspace:  For variables, look at type CreateWorkspaceVars in ../index.d.ts
const { data } = await CreateWorkspace(dataConnect, createWorkspaceVars);

// Operation DeleteWorkspace:  For variables, look at type DeleteWorkspaceVars in ../index.d.ts
const { data } = await DeleteWorkspace(dataConnect, deleteWorkspaceVars);


```