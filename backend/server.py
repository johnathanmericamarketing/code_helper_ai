from fastapi import FastAPI, APIRouter, HTTPException
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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Encryption key (in production, store this securely in env)
ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY', Fernet.generate_key())
cipher_suite = Fernet(ENCRYPTION_KEY if isinstance(ENCRYPTION_KEY, bytes) else ENCRYPTION_KEY.encode())

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


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
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
