"""
Processor - Inserts requirement into Excel.
"""

from typing import Dict, Any
from .excel_handler import append_requirement_to_excel


def insert_to_excel(requirement: Dict[str, Any]) -> Dict[str, Any]:
    """Insert requirement dict into Excel file."""
    success = append_requirement_to_excel(requirement)
    
    if success:
        return {"status": "inserted", "message": f"'{requirement.get('attribute')}' added to Excel"}
    else:
        return {"status": "error", "message": "Failed to insert into Excel"}
