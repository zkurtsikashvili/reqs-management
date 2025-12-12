from pydantic import BaseModel
from datetime import datetime

class RequirementCreate(BaseModel):
    attribute: str
    description: str
    domain: str
    source_system: str
    source_entity: str
    responsible_analyst: str

class RequirementResponse(BaseModel):
    id: int
    attribute: str
    description: str
    domain: str
    source_system: str
    source_entity: str
    responsible_analyst: str
    created_at: datetime

    class Config:
        from_attributes = True
