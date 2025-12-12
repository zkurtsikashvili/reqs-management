from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(Integer, primary_key=True, index=True)
    attribute = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    domain = Column(String(255), nullable=False)
    source_system = Column(String(255), nullable=False)
    source_entity = Column(String(255), nullable=False)
    responsible_analyst = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
