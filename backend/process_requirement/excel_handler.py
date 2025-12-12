"""
Excel Handler - Inserts requirements into Excel file.
"""

from pathlib import Path
from typing import Dict, Any
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

DATA_DIR = Path(__file__).parent.parent / "data"
EXCEL_FILE_PATH = DATA_DIR / "requirements_data.xlsx"

COLUMNS = ["attribute", "description", "domain", "source_system", "source_entity", "responsible_analyst"]


def append_requirement_to_excel(requirement: Dict[str, Any]) -> bool:
    """Append a requirement to Excel file."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    try:
        if EXCEL_FILE_PATH.exists():
            workbook = load_workbook(EXCEL_FILE_PATH)
            sheet = workbook.active
        else:
            workbook = Workbook()
            sheet = workbook.active
            sheet.title = "Requirements"
            
            # Create header row
            header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
            header_font = Font(bold=True, color="FFFFFF")
            
            for col_idx, col_name in enumerate(COLUMNS, start=1):
                cell = sheet.cell(row=1, column=col_idx)
                cell.value = col_name.replace("_", " ").title()
                cell.fill = header_fill
                cell.font = header_font
                sheet.column_dimensions[cell.column_letter].width = 20
        
        # Add requirement data
        next_row = sheet.max_row + 1
        for col_idx, col_name in enumerate(COLUMNS, start=1):
            sheet.cell(row=next_row, column=col_idx, value=requirement.get(col_name, ""))
        
        workbook.save(EXCEL_FILE_PATH)
        workbook.close()
        return True
    except Exception as e:
        print(f"Error writing to Excel: {e}")
        return False
