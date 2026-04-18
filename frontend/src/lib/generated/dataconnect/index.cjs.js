const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'code-helper-connector',
  service: 'code-helper-studio-fdc',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';
exports.upsertUserRef = upsertUserRef;

exports.upsertUser = function upsertUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserRef(dcInstance, inputVars));
}
;

const updateUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserProfile', inputVars);
}
updateUserProfileRef.operationName = 'UpdateUserProfile';
exports.updateUserProfileRef = updateUserProfileRef;

exports.updateUserProfile = function updateUserProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateUserProfileRef(dcInstance, inputVars));
}
;

const updateAiModelRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAiModel', inputVars);
}
updateAiModelRef.operationName = 'UpdateAiModel';
exports.updateAiModelRef = updateAiModelRef;

exports.updateAiModel = function updateAiModel(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateAiModelRef(dcInstance, inputVars));
}
;

const recordAiUsageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordAiUsage', inputVars);
}
recordAiUsageRef.operationName = 'RecordAiUsage';
exports.recordAiUsageRef = recordAiUsageRef;

exports.recordAiUsage = function recordAiUsage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(recordAiUsageRef(dcInstance, inputVars));
}
;

const updateUserPlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserPlan', inputVars);
}
updateUserPlanRef.operationName = 'UpdateUserPlan';
exports.updateUserPlanRef = updateUserPlanRef;

exports.updateUserPlan = function updateUserPlan(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateUserPlanRef(dcInstance, inputVars));
}
;

const createProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProject', inputVars);
}
createProjectRef.operationName = 'CreateProject';
exports.createProjectRef = createProjectRef;

exports.createProject = function createProject(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProjectRef(dcInstance, inputVars));
}
;

const updateProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProject', inputVars);
}
updateProjectRef.operationName = 'UpdateProject';
exports.updateProjectRef = updateProjectRef;

exports.updateProject = function updateProject(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProjectRef(dcInstance, inputVars));
}
;

const updateProjectBrandRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProjectBrand', inputVars);
}
updateProjectBrandRef.operationName = 'UpdateProjectBrand';
exports.updateProjectBrandRef = updateProjectBrandRef;

exports.updateProjectBrand = function updateProjectBrand(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProjectBrandRef(dcInstance, inputVars));
}
;

const saveProjectIntakeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SaveProjectIntake', inputVars);
}
saveProjectIntakeRef.operationName = 'SaveProjectIntake';
exports.saveProjectIntakeRef = saveProjectIntakeRef;

exports.saveProjectIntake = function saveProjectIntake(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(saveProjectIntakeRef(dcInstance, inputVars));
}
;

const appendChangeLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AppendChangeLog', inputVars);
}
appendChangeLogRef.operationName = 'AppendChangeLog';
exports.appendChangeLogRef = appendChangeLogRef;

exports.appendChangeLog = function appendChangeLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(appendChangeLogRef(dcInstance, inputVars));
}
;

const softDeleteProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SoftDeleteProject', inputVars);
}
softDeleteProjectRef.operationName = 'SoftDeleteProject';
exports.softDeleteProjectRef = softDeleteProjectRef;

exports.softDeleteProject = function softDeleteProject(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(softDeleteProjectRef(dcInstance, inputVars));
}
;

const createKnowledgeEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateKnowledgeEntry', inputVars);
}
createKnowledgeEntryRef.operationName = 'CreateKnowledgeEntry';
exports.createKnowledgeEntryRef = createKnowledgeEntryRef;

exports.createKnowledgeEntry = function createKnowledgeEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createKnowledgeEntryRef(dcInstance, inputVars));
}
;

const updateKnowledgeEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateKnowledgeEntry', inputVars);
}
updateKnowledgeEntryRef.operationName = 'UpdateKnowledgeEntry';
exports.updateKnowledgeEntryRef = updateKnowledgeEntryRef;

exports.updateKnowledgeEntry = function updateKnowledgeEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateKnowledgeEntryRef(dcInstance, inputVars));
}
;

const deleteKnowledgeEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteKnowledgeEntry', inputVars);
}
deleteKnowledgeEntryRef.operationName = 'DeleteKnowledgeEntry';
exports.deleteKnowledgeEntryRef = deleteKnowledgeEntryRef;

exports.deleteKnowledgeEntry = function deleteKnowledgeEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteKnowledgeEntryRef(dcInstance, inputVars));
}
;

const createCodeRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCodeRequest', inputVars);
}
createCodeRequestRef.operationName = 'CreateCodeRequest';
exports.createCodeRequestRef = createCodeRequestRef;

exports.createCodeRequest = function createCodeRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCodeRequestRef(dcInstance, inputVars));
}
;

const updateCodeRequestStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCodeRequestStatus', inputVars);
}
updateCodeRequestStatusRef.operationName = 'UpdateCodeRequestStatus';
exports.updateCodeRequestStatusRef = updateCodeRequestStatusRef;

exports.updateCodeRequestStatus = function updateCodeRequestStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCodeRequestStatusRef(dcInstance, inputVars));
}
;

const createGeneratedCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateGeneratedCode', inputVars);
}
createGeneratedCodeRef.operationName = 'CreateGeneratedCode';
exports.createGeneratedCodeRef = createGeneratedCodeRef;

exports.createGeneratedCode = function createGeneratedCode(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createGeneratedCodeRef(dcInstance, inputVars));
}
;

const createServerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServer', inputVars);
}
createServerRef.operationName = 'CreateServer';
exports.createServerRef = createServerRef;

exports.createServer = function createServer(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createServerRef(dcInstance, inputVars));
}
;

const updateServerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateServer', inputVars);
}
updateServerRef.operationName = 'UpdateServer';
exports.updateServerRef = updateServerRef;

exports.updateServer = function updateServer(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateServerRef(dcInstance, inputVars));
}
;

const recordServerConnectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordServerConnection', inputVars);
}
recordServerConnectionRef.operationName = 'RecordServerConnection';
exports.recordServerConnectionRef = recordServerConnectionRef;

exports.recordServerConnection = function recordServerConnection(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(recordServerConnectionRef(dcInstance, inputVars));
}
;

const deleteServerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteServer', inputVars);
}
deleteServerRef.operationName = 'DeleteServer';
exports.deleteServerRef = deleteServerRef;

exports.deleteServer = function deleteServer(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteServerRef(dcInstance, inputVars));
}
;

const createDeployLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDeployLog', inputVars);
}
createDeployLogRef.operationName = 'CreateDeployLog';
exports.createDeployLogRef = createDeployLogRef;

exports.createDeployLog = function createDeployLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDeployLogRef(dcInstance, inputVars));
}
;

const getCurrentUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUser');
}
getCurrentUserRef.operationName = 'GetCurrentUser';
exports.getCurrentUserRef = getCurrentUserRef;

exports.getCurrentUser = function getCurrentUser(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getCurrentUserRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listProjectsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProjects');
}
listProjectsRef.operationName = 'ListProjects';
exports.listProjectsRef = listProjectsRef;

exports.listProjects = function listProjects(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listProjectsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProject', inputVars);
}
getProjectRef.operationName = 'GetProject';
exports.getProjectRef = getProjectRef;

exports.getProject = function getProject(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getProjectRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listKnowledgeByProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListKnowledgeByProject', inputVars);
}
listKnowledgeByProjectRef.operationName = 'ListKnowledgeByProject';
exports.listKnowledgeByProjectRef = listKnowledgeByProjectRef;

exports.listKnowledgeByProject = function listKnowledgeByProject(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listKnowledgeByProjectRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listBrandKnowledgeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBrandKnowledge', inputVars);
}
listBrandKnowledgeRef.operationName = 'ListBrandKnowledge';
exports.listBrandKnowledgeRef = listBrandKnowledgeRef;

exports.listBrandKnowledge = function listBrandKnowledge(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listBrandKnowledgeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listCodeRequestsByProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCodeRequestsByProject', inputVars);
}
listCodeRequestsByProjectRef.operationName = 'ListCodeRequestsByProject';
exports.listCodeRequestsByProjectRef = listCodeRequestsByProjectRef;

exports.listCodeRequestsByProject = function listCodeRequestsByProject(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listCodeRequestsByProjectRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getCodeRequestWithCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCodeRequestWithCode', inputVars);
}
getCodeRequestWithCodeRef.operationName = 'GetCodeRequestWithCode';
exports.getCodeRequestWithCodeRef = getCodeRequestWithCodeRef;

exports.getCodeRequestWithCode = function getCodeRequestWithCode(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCodeRequestWithCodeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listServersByProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListServersByProject', inputVars);
}
listServersByProjectRef.operationName = 'ListServersByProject';
exports.listServersByProjectRef = listServersByProjectRef;

exports.listServersByProject = function listServersByProject(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listServersByProjectRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getServerForFunctionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServerForFunction', inputVars);
}
getServerForFunctionRef.operationName = 'GetServerForFunction';
exports.getServerForFunctionRef = getServerForFunctionRef;

exports.getServerForFunction = function getServerForFunction(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getServerForFunctionRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listDeployLogsByProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDeployLogsByProject', inputVars);
}
listDeployLogsByProjectRef.operationName = 'ListDeployLogsByProject';
exports.listDeployLogsByProjectRef = listDeployLogsByProjectRef;

exports.listDeployLogsByProject = function listDeployLogsByProject(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listDeployLogsByProjectRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
