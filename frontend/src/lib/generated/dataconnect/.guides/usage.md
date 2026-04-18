# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUser, updateUserProfile, updateAiModel, recordAiUsage, updateUserPlan, createProject, updateProject, updateProjectBrand, saveProjectIntake, appendChangeLog } from '@code-helper/dataconnect';


// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation UpdateUserProfile:  For variables, look at type UpdateUserProfileVars in ../index.d.ts
const { data } = await UpdateUserProfile(dataConnect, updateUserProfileVars);

// Operation UpdateAiModel:  For variables, look at type UpdateAiModelVars in ../index.d.ts
const { data } = await UpdateAiModel(dataConnect, updateAiModelVars);

// Operation RecordAiUsage:  For variables, look at type RecordAiUsageVars in ../index.d.ts
const { data } = await RecordAiUsage(dataConnect, recordAiUsageVars);

// Operation UpdateUserPlan:  For variables, look at type UpdateUserPlanVars in ../index.d.ts
const { data } = await UpdateUserPlan(dataConnect, updateUserPlanVars);

// Operation CreateProject:  For variables, look at type CreateProjectVars in ../index.d.ts
const { data } = await CreateProject(dataConnect, createProjectVars);

// Operation UpdateProject:  For variables, look at type UpdateProjectVars in ../index.d.ts
const { data } = await UpdateProject(dataConnect, updateProjectVars);

// Operation UpdateProjectBrand:  For variables, look at type UpdateProjectBrandVars in ../index.d.ts
const { data } = await UpdateProjectBrand(dataConnect, updateProjectBrandVars);

// Operation SaveProjectIntake:  For variables, look at type SaveProjectIntakeVars in ../index.d.ts
const { data } = await SaveProjectIntake(dataConnect, saveProjectIntakeVars);

// Operation AppendChangeLog:  For variables, look at type AppendChangeLogVars in ../index.d.ts
const { data } = await AppendChangeLog(dataConnect, appendChangeLogVars);


```