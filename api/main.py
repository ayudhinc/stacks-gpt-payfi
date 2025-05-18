from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from api.llm_service import generate
from api.clarinet_service import compile_snippet, deploy

app = FastAPI(title="PayFi Copilot API", version="0.1.0")

class GenReq(BaseModel):
    prompt: str = Field(..., example="Daily subscription with 3-day trial…")
    max_tokens: int = 350

class GenResp(BaseModel):
    code: str

@app.post("/generate", response_model=GenResp)
def gen(req: GenReq):
    code = generate(req.prompt, req.max_tokens)
    return {"code": code}

class CompileReq(BaseModel):
    code: str

class CompileResp(BaseModel):
    success: bool
    diagnostics: list[str]

@app.post("/compile", response_model=CompileResp)
def compile(req: CompileReq):
    diags = compile_snippet(req.code)
    return {"success": len(diags) == 0, "diagnostics": diags}

class DeployReq(BaseModel):
    code: str
    name: str | None = None

class DeployResp(BaseModel):
    txid: str
