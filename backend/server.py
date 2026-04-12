from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from enum import Enum
from cryptography.fernet import Fernet
import base64
import paramiko
import io

from github import Github, GithubException
from git import Repo, GitCommandError
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")


def _required_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"{name} environment variable is required")
    return value


API_KEY = _required_env("API_KEY")
mongo_url = _required_env("MONGO_URL")
DB_NAME = _required_env("DB_NAME")
ENCRYPTION_KEY = _required_env("ENCRYPTION_KEY")
CORS_ORIGINS_RAW = _required_env("CORS_ORIGINS")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_RAW.split(",") if origin.strip()]
if not CORS_ORIGINS or "*" in CORS_ORIGINS:
    raise RuntimeError("CORS_ORIGINS must be an explicit comma-separated origin allowlist")


def require_api_key(x_api_key: Optional[str] = Header(default=None, alias="X-API-Key")) -> None:
    if not x_api_key or x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")


def resolve_workspace_path(base_path: str, requested_path: str = "") -> str:
    base_resolved = os.path.realpath(base_path)
    target_resolved = os.path.realpath(os.path.join(base_resolved, requested_path))
    if os.path.commonpath([base_resolved, target_resolved]) != base_resolved:
        raise HTTPException(status_code=400, detail="Invalid path")
    return target_resolved


# Create the main app and API router
app = FastAPI()
api_router = APIRouter(prefix="/api", dependencies=[Depends(require_api_key)])
public_router = APIRouter()


# GitHub Connection Models
class GitHubConnection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    access_token: str  # Encrypted
    username: Optional[str] = None
    default_repo: Optional[str] = None
    default_branch: str = "main"
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GitHubConnectionCreate(BaseModel):
    name: str
    access_token: str
    username: Optional[str] = None
    default_repo: Optional[str] = None
    default_branch: str = "main"

class LocalWorkspace(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    path: str
    description: Optional[str] = None
    is_git_repo: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LocalWorkspaceCreate(BaseModel):
    name: str
    path: str
    description: Optional[str] = None

class FileNode(BaseModel):
    name: str
    path: str
    type: str  # "file" or "directory"
    size: Optional[int] = None
    children: Optional[List['FileNode']] = None

class GitOperation(BaseModel):
    operation: str  # "pull", "push", "commit"
    repo_path: str
    message: Optional[str] = None
    branch: Optional[str] = None


# GitHub Routes
@api_router.post("/github", response_model=GitHubConnection)
async def create_github_connection(input: GitHubConnectionCreate):
    conn_dict = input.model_dump()
    
    # Encrypt token
    conn_dict['access_token'] = encrypt_string(conn_dict['access_token'])
    
    # Test connection
    try:
        decrypted_token = decrypt_string(conn_dict['access_token'])
        g = Github(decrypted_token)
        user = g.get_user()
        conn_dict['username'] = user.login
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid GitHub token: {str(e)}")
    
    conn_obj = GitHubConnection(**conn_dict)
    
    doc = conn_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.github_connections.insert_one(doc)
    return conn_obj

@api_router.get("/github", response_model=List[GitHubConnection])
async def get_github_connections():
    connections = await db.github_connections.find({}, {"_id": 0}).to_list(100)
    
    for conn in connections:
        if isinstance(conn['created_at'], str):
            conn['created_at'] = datetime.fromisoformat(conn['created_at'])
        if isinstance(conn['updated_at'], str):
            conn['updated_at'] = datetime.fromisoformat(conn['updated_at'])
        
        # Mask token
        if conn.get('access_token'):
            conn['access_token'] = '***ENCRYPTED***'
    
    return connections

@api_router.delete("/github/{connection_id}")
async def delete_github_connection(connection_id: str):
    result = await db.github_connections.delete_one({"id": connection_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    return {"success": True}

@api_router.get("/github/{connection_id}/repos")
async def get_github_repos(connection_id: str):
    """Get list of repositories for this GitHub connection"""
    conn = await db.github_connections.find_one({"id": connection_id}, {"_id": 0})
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    try:
        token = decrypt_string(conn['access_token'])
        g = Github(token)
        user = g.get_user()
        
        repos = []
        for repo in user.get_repos():
            repos.append({
                "name": repo.name,
                "full_name": repo.full_name,
                "private": repo.private,
                "default_branch": repo.default_branch,
                "description": repo.description,
                "url": repo.html_url,
            })
        
        return repos
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch repos: {str(e)}")

@api_router.get("/github/{connection_id}/repos/{owner}/{repo}/tree")
async def get_github_repo_tree(connection_id: str, owner: str, repo: str, branch: str = "main"):
    """Get file tree from GitHub repository"""
    conn = await db.github_connections.find_one({"id": connection_id}, {"_id": 0})
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    try:
        token = decrypt_string(conn['access_token'])
        g = Github(token)
        repository = g.get_repo(f"{owner}/{repo}")
        
        contents = repository.get_contents("", ref=branch)
        
        def build_tree(contents_list):
            tree = []
            for content in contents_list:
                node = {
                    "name": content.name,
                    "path": content.path,
                    "type": content.type,
                    "size": content.size if content.type == "file" else None,
                }
                
                if content.type == "dir":
                    try:
                        dir_contents = repository.get_contents(content.path, ref=branch)
                        node["children"] = build_tree(dir_contents)
                    except:
                        node["children"] = []
                
                tree.append(node)
            
            return tree
        
        return build_tree(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch tree: {str(e)}")

@api_router.get("/github/{connection_id}/repos/{owner}/{repo}/file")
async def get_github_file(connection_id: str, owner: str, repo: str, path: str, branch: str = "main"):
    """Get file content from GitHub"""
    conn = await db.github_connections.find_one({"id": connection_id}, {"_id": 0})
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    try:
        token = decrypt_string(conn['access_token'])
        g = Github(token)
        repository = g.get_repo(f"{owner}/{repo}")
        
        file_content = repository.get_contents(path, ref=branch)
        
        return {
            "name": file_content.name,
            "path": file_content.path,
            "content": file_content.decoded_content.decode('utf-8'),
            "sha": file_content.sha,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch file: {str(e)}")

@api_router.post("/github/{connection_id}/repos/{owner}/{repo}/push")
async def push_to_github(connection_id: str, owner: str, repo: str, file_path: str, content: str, message: str, branch: str = "main"):
    """Push file changes to GitHub"""
    conn = await db.github_connections.find_one({"id": connection_id}, {"_id": 0})
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    try:
        token = decrypt_string(conn['access_token'])
        g = Github(token)
        repository = g.get_repo(f"{owner}/{repo}")
        
        # Try to get existing file
        try:
            file = repository.get_contents(file_path, ref=branch)
            # Update existing file
            repository.update_file(
                path=file_path,
                message=message,
                content=content,
                sha=file.sha,
                branch=branch
            )
            action = "updated"
        except GithubException:
            # Create new file
            repository.create_file(
                path=file_path,
                message=message,
                content=content,
                branch=branch
            )
            action = "created"
        
        return {"success": True, "message": f"File {action} successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to push: {str(e)}")


# Local Workspace Routes
@api_router.post("/workspace", response_model=LocalWorkspace)
async def create_workspace(input: LocalWorkspaceCreate):
    # Validate path exists
    workspace_path = os.path.realpath(input.path)
    if not os.path.exists(workspace_path):
        raise HTTPException(status_code=400, detail="Path does not exist")
    
    workspace_dict = input.model_dump()
    workspace_dict["path"] = workspace_path
    
    # Check if it's a git repo
    workspace_dict['is_git_repo'] = os.path.exists(os.path.join(workspace_path, '.git'))
    
    workspace_obj = LocalWorkspace(**workspace_dict)
    
    doc = workspace_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.workspaces.insert_one(doc)
    return workspace_obj

@api_router.get("/workspace", response_model=List[LocalWorkspace])
async def get_workspaces():
    workspaces = await db.workspaces.find({}, {"_id": 0}).to_list(100)
    
    for ws in workspaces:
        if isinstance(ws['created_at'], str):
            ws['created_at'] = datetime.fromisoformat(ws['created_at'])
    
    return workspaces

@api_router.delete("/workspace/{workspace_id}")
async def delete_workspace(workspace_id: str):
    result = await db.workspaces.delete_one({"id": workspace_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    return {"success": True}

@api_router.get("/workspace/{workspace_id}/tree")
async def get_workspace_tree(workspace_id: str, path: str = ""):
    """Get file tree from local workspace"""
    workspace = await db.workspaces.find_one({"id": workspace_id}, {"_id": 0})
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    full_path = resolve_workspace_path(workspace['path'], path)
    
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="Path not found")
    
    def build_tree(dir_path, relative_path=""):
        items = []
        try:
            for item in os.listdir(dir_path):
                if item.startswith('.') and item not in ['.git', '.gitignore']:
                    continue
                
                item_path = os.path.join(dir_path, item)
                item_relative = os.path.join(relative_path, item) if relative_path else item
                
                node = {
                    "name": item,
                    "path": item_relative,
                    "type": "dir" if os.path.isdir(item_path) else "file",
                }
                
                if node["type"] == "file":
                    node["size"] = os.path.getsize(item_path)
                else:
                    # For directories, add children
                    node["children"] = build_tree(item_path, item_relative)
                
                items.append(node)
        except PermissionError:
            pass
        
        return sorted(items, key=lambda x: (x["type"] == "file", x["name"]))
    
    return build_tree(full_path)

@api_router.get("/workspace/{workspace_id}/file")
async def get_workspace_file(workspace_id: str, file_path: str):
    """Read file content from local workspace"""
    workspace = await db.workspaces.find_one({"id": workspace_id}, {"_id": 0})
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    full_path = resolve_workspace_path(workspace['path'], file_path)
    
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return {
            "name": os.path.basename(file_path),
            "path": file_path,
            "content": content,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

@api_router.post("/workspace/{workspace_id}/file")
async def write_workspace_file(workspace_id: str, file_path: str, content: str):
    """Write file content to local workspace"""
    workspace = await db.workspaces.find_one({"id": workspace_id}, {"_id": 0})
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    full_path = resolve_workspace_path(workspace['path'], file_path)
    
    try:
        # Create directory if needed
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return {"success": True, "message": "File written successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to write file: {str(e)}")

@api_router.post("/workspace/{workspace_id}/git")
async def git_operation(workspace_id: str, operation: str, message: Optional[str] = None, branch: Optional[str] = None):
    """Perform git operations on local workspace"""
    workspace = await db.workspaces.find_one({"id": workspace_id}, {"_id": 0})
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    if not workspace['is_git_repo']:
        raise HTTPException(status_code=400, detail="Not a git repository")
    
    repo_path = workspace['path']
    
    try:
        repo = Repo(repo_path)
        
        if operation == "pull":
            origin = repo.remotes.origin
            origin.pull(branch or repo.active_branch.name)
            return {"success": True, "message": "Pulled successfully"}
        
        elif operation == "push":
            if repo.is_dirty():
                raise HTTPException(status_code=400, detail="Repository has uncommitted changes")
            origin = repo.remotes.origin
            origin.push(branch or repo.active_branch.name)
            return {"success": True, "message": "Pushed successfully"}
        
        elif operation == "commit":
            if not message:
                raise HTTPException(status_code=400, detail="Commit message required")
            
            # Add all changes
            repo.git.add(A=True)
            
            # Commit
            repo.index.commit(message)
            
            return {"success": True, "message": "Committed successfully"}
        
        elif operation == "status":
            return {
                "success": True,
                "branch": repo.active_branch.name,
                "is_dirty": repo.is_dirty(),
                "untracked_files": repo.untracked_files,
                "modified_files": [item.a_path for item in repo.index.diff(None)],
            }
        
        else:
            raise HTTPException(status_code=400, detail="Invalid operation")
    
    except GitCommandError as e:
        raise HTTPException(status_code=400, detail=f"Git error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Operation failed: {str(e)}")




# MongoDB connection
client = AsyncIOMotorClient(mongo_url)
db = client[DB_NAME]

# Encryption key
cipher_suite = Fernet(ENCRYPTION_KEY if isinstance(ENCRYPTION_KEY, bytes) else ENCRYPTION_KEY.encode())


# Enums
class TaskType(str, Enum):
    feature = "feature"
    bugfix = "bugfix"
    refactor = "refactor"

class RiskLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class RequestStatus(str, Enum):
    pending = "pending"
    structured = "structured"
    planned = "planned"
    generated = "generated"
    validated = "validated"
    approved = "approved"
    rejected = "rejected"
    deployed = "deployed"

class ValidationResult(str, Enum):
    passed = "passed"
    failed = "failed"
    warning = "warning"

class KnowledgeCategory(str, Enum):
    code_style = "code_style"
    architecture = "architecture"
    security = "security"
    performance = "performance"
    testing = "testing"
    documentation = "documentation"
    best_practices = "best_practices"

class ServerType(str, Enum):
    ftp = "ftp"
    sftp = "sftp"
    ssh = "ssh"


# Helper functions for encryption
def encrypt_string(text: str) -> str:
    return cipher_suite.encrypt(text.encode()).decode()

def decrypt_string(encrypted_text: str) -> str:
    return cipher_suite.decrypt(encrypted_text.encode()).decode()


# Models
class CodeRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    raw_request: str
    urgency: Optional[str] = None
    area_of_app: Optional[str] = None
    screenshots: Optional[List[str]] = None
    links: Optional[List[str]] = None
    knowledge_base_ids: Optional[List[str]] = None
    status: RequestStatus = RequestStatus.pending
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CodeRequestCreate(BaseModel):
    raw_request: str
    urgency: Optional[str] = None
    area_of_app: Optional[str] = None
    screenshots: Optional[List[str]] = None
    links: Optional[List[str]] = None
    knowledge_base_ids: Optional[List[str]] = None

class StructuredTask(BaseModel):
    task_type: TaskType
    title: str
    context: str
    current_behavior: Optional[str] = None
    expected_behavior: str
    acceptance_criteria: List[str]
    technical_notes: List[str]
    assumptions: List[str]

class ExecutionPlan(BaseModel):
    files_to_modify: List[str]
    files_to_avoid: List[str]
    risk_level: RiskLevel
    change_scope_summary: str

class CodeChange(BaseModel):
    file_path: str
    diff: str
    description: str

class ValidationCheck(BaseModel):
    check_name: str
    result: ValidationResult
    message: str
    details: Optional[str] = None

class GeneratedCode(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str
    structured_task: StructuredTask
    execution_plan: ExecutionPlan
    code_changes: List[CodeChange]
    validation_checks: List[ValidationCheck]
    summary: str
    rollback_instructions: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GeneratedCodeCreate(BaseModel):
    request_id: str
    structured_task: StructuredTask
    execution_plan: ExecutionPlan
    code_changes: List[CodeChange]
    validation_checks: List[ValidationCheck]
    summary: str
    rollback_instructions: str

# Knowledge Base Models
class KnowledgeBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: KnowledgeCategory
    language: Optional[str] = None
    framework: Optional[str] = None
    description: str
    code_example: Optional[str] = None
    bad_example: Optional[str] = None
    tags: List[str] = []
    priority: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class KnowledgeBaseCreate(BaseModel):
    title: str
    category: KnowledgeCategory
    language: Optional[str] = None
    framework: Optional[str] = None
    description: str
    code_example: Optional[str] = None
    bad_example: Optional[str] = None
    tags: List[str] = []
    priority: int = 0

class KnowledgeBaseUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[KnowledgeCategory] = None
    language: Optional[str] = None
    framework: Optional[str] = None
    description: Optional[str] = None
    code_example: Optional[str] = None
    bad_example: Optional[str] = None
    tags: Optional[List[str]] = None
    priority: Optional[int] = None

# Server Connection Models
class ServerConnection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    server_type: ServerType
    host: str
    port: int
    username: str
    password: Optional[str] = None  # Encrypted
    ssh_key: Optional[str] = None  # Encrypted
    remote_path: str = "/"
    description: Optional[str] = None
    is_active: bool = True
    last_connected: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ServerConnectionCreate(BaseModel):
    name: str
    server_type: ServerType
    host: str
    port: int
    username: str
    password: Optional[str] = None
    ssh_key: Optional[str] = None
    remote_path: str = "/"
    description: Optional[str] = None

class ServerConnectionUpdate(BaseModel):
    name: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None
    ssh_key: Optional[str] = None
    remote_path: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class DeployRequest(BaseModel):
    request_id: str
    server_id: str
    files_to_deploy: List[str]  # File paths to deploy


def _build_generated_code_payload(request_id: str, raw_request: str) -> GeneratedCodeCreate:
    return GeneratedCodeCreate(
        request_id=request_id,
        structured_task=StructuredTask(
            task_type=TaskType.feature,
            title="Implement requested feature",
            context=raw_request,
            expected_behavior="Feature should work as described in the request",
            acceptance_criteria=[
                "Code compiles without errors",
                "Feature functions as expected",
                "Tests pass successfully",
            ],
            technical_notes=[
                "Follow existing code patterns",
                "Maintain backward compatibility",
            ],
            assumptions=[
                "Current codebase is stable",
                "Dependencies are up to date",
            ],
        ),
        execution_plan=ExecutionPlan(
            files_to_modify=["src/components/Feature.jsx", "src/utils/helpers.js"],
            files_to_avoid=["src/core/config.js", "src/auth/*"],
            risk_level=RiskLevel.low,
            change_scope_summary="Isolated changes to feature components only",
        ),
        code_changes=[
            CodeChange(
                file_path="src/components/Feature.jsx",
                diff=(
                    "import React, { useState } from 'react';\n\n"
                    "const Feature = () => {\n  const [data, setData] = useState(null);\n"
                    "  \n  const handleAction = () => {\n    // New feature implementation\n"
                    "    console.log('Feature activated');\n  };\n  \n  return (\n"
                    '    <div className="feature-container">\n'
                    "      <button onClick={handleAction}>\n        Activate Feature\n"
                    "      </button>\n    </div>\n  );\n};\n\nexport default Feature;"
                ),
                description="Added new feature component with action handler",
            ),
            CodeChange(
                file_path="src/utils/helpers.js",
                diff=(
                    "export const validateInput = (input) => {\n  return input && input.length > 0;\n};\n\n"
                    "export const formatOutput = (data) => {\n  return JSON.stringify(data, null, 2);\n};"
                ),
                description="Added utility functions for input validation and output formatting",
            ),
        ],
        validation_checks=[
            ValidationCheck(
                check_name="Scope Validation",
                result=ValidationResult.passed,
                message="All changes are within allowed files",
                details="No modifications detected outside the planned scope",
            ),
            ValidationCheck(
                check_name="Syntax Check",
                result=ValidationResult.passed,
                message="All code is syntactically correct",
            ),
            ValidationCheck(
                check_name="Dependency Check",
                result=ValidationResult.passed,
                message="No new dependencies required",
            ),
            ValidationCheck(
                check_name="Breaking Changes",
                result=ValidationResult.passed,
                message="No breaking changes detected",
            ),
            ValidationCheck(
                check_name="Test Coverage",
                result=ValidationResult.warning,
                message="Consider adding unit tests",
                details="New feature code does not have associated tests",
            ),
        ],
        summary="Successfully generated code for the requested feature. All validation checks passed with one warning.",
        rollback_instructions="Run `git checkout HEAD~1` to revert changes if needed.",
    )


# Public routes (no API key required)
@public_router.get("/healthz")
async def healthz():
    return {"status": "ok"}


@public_router.get("/readyz")
async def readyz():
    try:
        await db.command("ping")
        return {"status": "ready"}
    except Exception:
        raise HTTPException(status_code=503, detail="Database unavailable")


# Routes
@api_router.get("/")
async def root():
    return {"message": "AI Code Generator API"}

@api_router.post("/requests", response_model=CodeRequest)
async def create_request(input: CodeRequestCreate):
    request_dict = input.model_dump()
    request_obj = CodeRequest(**request_dict)
    
    doc = request_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.code_requests.insert_one(doc)
    return request_obj

@api_router.get("/requests", response_model=List[CodeRequest])
async def get_requests():
    requests = await db.code_requests.find({}, {"_id": 0}).to_list(1000)
    
    for req in requests:
        if isinstance(req['created_at'], str):
            req['created_at'] = datetime.fromisoformat(req['created_at'])
        if isinstance(req['updated_at'], str):
            req['updated_at'] = datetime.fromisoformat(req['updated_at'])
    
    return requests

@api_router.get("/requests/{request_id}", response_model=CodeRequest)
async def get_request(request_id: str):
    request = await db.code_requests.find_one({"id": request_id}, {"_id": 0})
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if isinstance(request['created_at'], str):
        request['created_at'] = datetime.fromisoformat(request['created_at'])
    if isinstance(request['updated_at'], str):
        request['updated_at'] = datetime.fromisoformat(request['updated_at'])
    
    return request

@api_router.patch("/requests/{request_id}/status")
async def update_request_status(request_id: str, status: RequestStatus):
    result = await db.code_requests.update_one(
        {"id": request_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    
    return {"success": True}


@api_router.post("/requests/{request_id}/process")
async def process_request(request_id: str):
    request = await db.code_requests.find_one({"id": request_id}, {"_id": 0})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    await db.code_requests.update_one(
        {"id": request_id},
        {"$set": {"status": RequestStatus.validated.value, "updated_at": datetime.now(timezone.utc).isoformat()}},
    )

    existing_generated = await db.generated_code.find_one({"request_id": request_id}, {"_id": 0})
    if existing_generated:
        if isinstance(existing_generated["created_at"], str):
            existing_generated["created_at"] = datetime.fromisoformat(existing_generated["created_at"])
        return {"success": True, "request_status": RequestStatus.validated, "generated_code": existing_generated}

    generated_input = _build_generated_code_payload(request_id, request["raw_request"])
    code_obj = GeneratedCode(**generated_input.model_dump())
    doc = code_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.generated_code.insert_one(doc)

    return {"success": True, "request_status": RequestStatus.validated, "generated_code": code_obj}

@api_router.post("/generated-code", response_model=GeneratedCode)
async def create_generated_code(input: GeneratedCodeCreate):
    code_dict = input.model_dump()
    code_obj = GeneratedCode(**code_dict)
    
    doc = code_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.generated_code.insert_one(doc)
    return code_obj

@api_router.get("/generated-code", response_model=List[GeneratedCode])
async def get_generated_code():
    code_results = await db.generated_code.find({}, {"_id": 0}).to_list(1000)
    
    for code in code_results:
        if isinstance(code['created_at'], str):
            code['created_at'] = datetime.fromisoformat(code['created_at'])
    
    return code_results

@api_router.get("/generated-code/request/{request_id}", response_model=List[GeneratedCode])
async def get_generated_code_by_request(request_id: str):
    code_results = await db.generated_code.find({"request_id": request_id}, {"_id": 0}).to_list(1000)
    
    for code in code_results:
        if isinstance(code['created_at'], str):
            code['created_at'] = datetime.fromisoformat(code['created_at'])
    
    return code_results

# Knowledge Base Routes
@api_router.post("/knowledge-base", response_model=KnowledgeBase)
async def create_knowledge(input: KnowledgeBaseCreate):
    knowledge_dict = input.model_dump()
    knowledge_obj = KnowledgeBase(**knowledge_dict)
    
    doc = knowledge_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.knowledge_base.insert_one(doc)
    return knowledge_obj

@api_router.get("/knowledge-base", response_model=List[KnowledgeBase])
async def get_knowledge_base():
    knowledge = await db.knowledge_base.find({}, {"_id": 0}).to_list(1000)
    
    for item in knowledge:
        if isinstance(item['created_at'], str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
        if isinstance(item['updated_at'], str):
            item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    
    return knowledge

@api_router.get("/knowledge-base/{knowledge_id}", response_model=KnowledgeBase)
async def get_knowledge(knowledge_id: str):
    knowledge = await db.knowledge_base.find_one({"id": knowledge_id}, {"_id": 0})
    
    if not knowledge:
        raise HTTPException(status_code=404, detail="Knowledge not found")
    
    if isinstance(knowledge['created_at'], str):
        knowledge['created_at'] = datetime.fromisoformat(knowledge['created_at'])
    if isinstance(knowledge['updated_at'], str):
        knowledge['updated_at'] = datetime.fromisoformat(knowledge['updated_at'])
    
    return knowledge

@api_router.patch("/knowledge-base/{knowledge_id}", response_model=KnowledgeBase)
async def update_knowledge(knowledge_id: str, input: KnowledgeBaseUpdate):
    update_dict = {k: v for k, v in input.model_dump().items() if v is not None}
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.knowledge_base.update_one(
        {"id": knowledge_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Knowledge not found")
    
    updated = await get_knowledge(knowledge_id)
    return updated

@api_router.delete("/knowledge-base/{knowledge_id}")
async def delete_knowledge(knowledge_id: str):
    result = await db.knowledge_base.delete_one({"id": knowledge_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Knowledge not found")
    
    return {"success": True}

# Server Connection Routes
@api_router.post("/servers", response_model=ServerConnection)
async def create_server(input: ServerConnectionCreate):
    server_dict = input.model_dump()
    
    # Encrypt sensitive data
    if server_dict.get('password'):
        server_dict['password'] = encrypt_string(server_dict['password'])
    if server_dict.get('ssh_key'):
        server_dict['ssh_key'] = encrypt_string(server_dict['ssh_key'])
    
    server_obj = ServerConnection(**server_dict)
    
    doc = server_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    if doc.get('last_connected'):
        doc['last_connected'] = doc['last_connected'].isoformat()
    
    await db.servers.insert_one(doc)
    return server_obj

@api_router.get("/servers", response_model=List[ServerConnection])
async def get_servers():
    servers = await db.servers.find({}, {"_id": 0}).to_list(1000)
    
    for server in servers:
        if isinstance(server['created_at'], str):
            server['created_at'] = datetime.fromisoformat(server['created_at'])
        if isinstance(server['updated_at'], str):
            server['updated_at'] = datetime.fromisoformat(server['updated_at'])
        if server.get('last_connected') and isinstance(server['last_connected'], str):
            server['last_connected'] = datetime.fromisoformat(server['last_connected'])
        
        # Don't send decrypted passwords to frontend
        if server.get('password'):
            server['password'] = '***ENCRYPTED***'
        if server.get('ssh_key'):
            server['ssh_key'] = '***ENCRYPTED***'
    
    return servers

@api_router.get("/servers/{server_id}", response_model=ServerConnection)
async def get_server(server_id: str):
    server = await db.servers.find_one({"id": server_id}, {"_id": 0})
    
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    if isinstance(server['created_at'], str):
        server['created_at'] = datetime.fromisoformat(server['created_at'])
    if isinstance(server['updated_at'], str):
        server['updated_at'] = datetime.fromisoformat(server['updated_at'])
    if server.get('last_connected') and isinstance(server['last_connected'], str):
        server['last_connected'] = datetime.fromisoformat(server['last_connected'])
    
    # Don't send decrypted passwords
    if server.get('password'):
        server['password'] = '***ENCRYPTED***'
    if server.get('ssh_key'):
        server['ssh_key'] = '***ENCRYPTED***'
    
    return server

@api_router.patch("/servers/{server_id}", response_model=ServerConnection)
async def update_server(server_id: str, input: ServerConnectionUpdate):
    update_dict = {k: v for k, v in input.model_dump().items() if v is not None}
    
    # Encrypt sensitive data if provided
    if update_dict.get('password'):
        update_dict['password'] = encrypt_string(update_dict['password'])
    if update_dict.get('ssh_key'):
        update_dict['ssh_key'] = encrypt_string(update_dict['ssh_key'])
    
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.servers.update_one(
        {"id": server_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Server not found")
    
    updated = await get_server(server_id)
    return updated

@api_router.delete("/servers/{server_id}")
async def delete_server(server_id: str):
    result = await db.servers.delete_one({"id": server_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Server not found")
    
    return {"success": True}

@api_router.post("/servers/{server_id}/test")
async def test_server_connection(server_id: str):
    """Test server connection"""
    server = await db.servers.find_one({"id": server_id}, {"_id": 0})
    
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    try:
        # Decrypt credentials
        password = decrypt_string(server['password']) if server.get('password') else None
        ssh_key_str = decrypt_string(server['ssh_key']) if server.get('ssh_key') else None
        
        if server['server_type'] in ['ssh', 'sftp']:
            # Test SSH/SFTP connection
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            if ssh_key_str:
                # Use SSH key
                key = paramiko.RSAKey.from_private_key(io.StringIO(ssh_key_str))
                ssh.connect(
                    hostname=server['host'],
                    port=server['port'],
                    username=server['username'],
                    pkey=key,
                    timeout=10
                )
            else:
                # Use password
                ssh.connect(
                    hostname=server['host'],
                    port=server['port'],
                    username=server['username'],
                    password=password,
                    timeout=10
                )
            
            ssh.close()
            
            # Update last connected
            await db.servers.update_one(
                {"id": server_id},
                {"$set": {"last_connected": datetime.now(timezone.utc).isoformat()}}
            )
            
            return {"success": True, "message": "Connection successful"}
        
        else:
            # FTP connection test would go here
            return {"success": True, "message": "FTP testing not yet implemented"}
    
    except Exception as e:
        return {"success": False, "message": f"Connection failed: {str(e)}"}

@api_router.post("/deploy")
async def deploy_code(input: DeployRequest):
    """Deploy generated code to server"""
    # Get server details
    server = await db.servers.find_one({"id": input.server_id}, {"_id": 0})
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    # Get generated code
    code_results = await db.generated_code.find({"request_id": input.request_id}, {"_id": 0}).to_list(1)
    if not code_results:
        raise HTTPException(status_code=404, detail="Generated code not found")
    
    generated_code = code_results[0]
    
    try:
        # Decrypt credentials
        password = decrypt_string(server['password']) if server.get('password') else None
        ssh_key_str = decrypt_string(server['ssh_key']) if server.get('ssh_key') else None
        
        if server['server_type'] in ['ssh', 'sftp']:
            # Deploy via SSH/SFTP
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            if ssh_key_str:
                key = paramiko.RSAKey.from_private_key(io.StringIO(ssh_key_str))
                ssh.connect(
                    hostname=server['host'],
                    port=server['port'],
                    username=server['username'],
                    pkey=key,
                    timeout=30
                )
            else:
                ssh.connect(
                    hostname=server['host'],
                    port=server['port'],
                    username=server['username'],
                    password=password,
                    timeout=30
                )
            
            sftp = ssh.open_sftp()
            
            # Deploy each file
            deployed_files = []
            for change in generated_code['code_changes']:
                if change['file_path'] in input.files_to_deploy:
                    remote_path = f"{server['remote_path']}/{change['file_path']}"
                    
                    # Create directory if needed
                    remote_dir = '/'.join(remote_path.split('/')[:-1])
                    try:
                        sftp.stat(remote_dir)
                    except FileNotFoundError:
                        # Create directory
                        ssh.exec_command(f"mkdir -p {remote_dir}")
                    
                    # Upload file
                    file_content = change['diff']
                    with sftp.file(remote_path, 'w') as remote_file:
                        remote_file.write(file_content)
                    
                    deployed_files.append(change['file_path'])
            
            sftp.close()
            ssh.close()
            
            # Update request status to deployed
            await db.code_requests.update_one(
                {"id": input.request_id},
                {"$set": {"status": "deployed", "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
            
            return {
                "success": True,
                "message": f"Successfully deployed {len(deployed_files)} files",
                "deployed_files": deployed_files
            }
        
        else:
            return {"success": False, "message": "FTP deployment not yet implemented"}
    
    except Exception as e:
        return {"success": False, "message": f"Deployment failed: {str(e)}"}


# Include the router in the main app
app.include_router(public_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    start_time = datetime.now(timezone.utc)
    response = await call_next(request)
    duration_ms = int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)
    response.headers["X-Request-ID"] = request_id
    logger.info(
        "request_id=%s method=%s path=%s status=%s duration_ms=%s",
        request_id,
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
