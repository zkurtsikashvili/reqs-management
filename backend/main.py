from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db, Base
from models import Requirement
from schemas import RequirementCreate, RequirementResponse

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Requirements Gathering API",
    description="API for data analysts to submit and manage requirements",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", '*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    """API health check"""
    return {"status": "healthy", "message": "Requirements Gathering API"}

@app.post("/requirements", status_code=201)
def create_requirement(req: RequirementCreate, db: Session = Depends(get_db)):
    """Create a new requirement and insert into Excel"""
    from process_requirement.processor import insert_to_excel
    
    # Create DB model instance using unpacked dictionary
    req_data = req.dict(exclude_unset=True)
    db_requirement = Requirement(**req_data)
    
    db.add(db_requirement)
    db.commit()
    db.refresh(db_requirement)
    
    # Insert into Excel
    excel_result = insert_to_excel(req_data)
    
    return {
        "requirement": {
            "id": db_requirement.id,
            **req_data,
            "created_at": db_requirement.created_at.isoformat()
        },
        "excel_processing": excel_result
    }

@app.get("/requirements", response_model=List[RequirementResponse])
def get_requirements(db: Session = Depends(get_db)):
    """Get all requirements"""
    latest_req = db.query(Requirement).order_by(Requirement.created_at.desc()).first()
    return [latest_req] if latest_req else []

@app.get("/requirements/{requirement_id}", response_model=RequirementResponse)
def get_requirement(requirement_id: int, db: Session = Depends(get_db)):
    """Get a specific requirement by ID"""
    requirement = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")
    return requirement

@app.delete("/requirements/{requirement_id}", status_code=204)
def delete_requirement(requirement_id: int, db: Session = Depends(get_db)):
    """Delete a requirement by ID"""
    requirement = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")
    db.delete(requirement)
    db.commit()
    return None
