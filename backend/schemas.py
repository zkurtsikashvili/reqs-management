from pydantic import BaseModel
from datetime import datetime

from typing import Optional

class RequirementCreate(BaseModel):
    target_field_name: Optional[str] = None
    description: Optional[str] = None
    target_datamart: Optional[str] = None
    target_field_type: Optional[str] = None
    primary_key: Optional[str] = None
    business_key: Optional[str] = None
    nullable: Optional[str] = None
    default_value: Optional[str] = None
    source_field: Optional[str] = None
    source_object_event: Optional[str] = None
    source_system_topic: Optional[str] = None
    source_type: Optional[str] = None
    transformation_rules: Optional[str] = None
    is_derived_value: Optional[str] = None
    derived_value_logic: Optional[str] = None
    data_quality_rules: Optional[str] = None
    foreign_key_reference_table: Optional[str] = None
    foreign_key_reference_field: Optional[str] = None
    pii_flag: Optional[str] = None
    sensitivity_level: Optional[str] = None
    security_rule: Optional[str] = None
    retention_policy: Optional[str] = None
    archiving_policy: Optional[str] = None
    source_retention: Optional[str] = None
    source_archiving_policy: Optional[str] = None
    data_owner: Optional[str] = None
    data_steward: Optional[str] = None
    comment_notes: Optional[str] = None
    storage: Optional[str] = None
    latency_requirements: Optional[str] = None
    is_renamed: Optional[str] = None
    sla_datamart_level: Optional[str] = None
    archiving_datamart_level: Optional[str] = None
    retention_datamart_level: Optional[str] = None

class RequirementUpdate(RequirementCreate):
    pass

class RequirementResponse(RequirementCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
