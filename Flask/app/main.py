from fastapi import FastAPI
from app.routes import workflow

app = FastAPI()
app.include_router(workflow.router, prefix="/api/workflow")
