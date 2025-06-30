from fastapi import APIRouter, Request
from app.services.executor import execute_workflow

router = APIRouter()

@router.post("/execute")
async def execute(request: Request):
    body = await request.json()
    result = await execute_workflow(body)
    return {"success": True, "result": result}
