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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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


# Models
class CodeRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    raw_request: str
    urgency: Optional[str] = None
    area_of_app: Optional[str] = None
    screenshots: Optional[List[str]] = None
    links: Optional[List[str]] = None
    knowledge_base_ids: Optional[List[str]] = None  # New field
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
    priority: int = 0  # Higher priority = more important
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
