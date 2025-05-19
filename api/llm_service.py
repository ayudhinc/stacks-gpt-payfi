import os, pathlib, torch
from peft import PeftModel
from transformers import AutoTokenizer, AutoModelForCausalLM

BASE    = os.getenv("PAYFI_BASE_MODEL",  "meta-llama/Meta-Llama-3-8B-Instruct")
ADAPTER = os.getenv("PAYFI_LORA_PATH",   "ayudhinc/payfi-copilot-lora")

# lazy singletons so cold-start is fast
_tokenizer = _model = None

def _load_model():
    global _tokenizer, _model
    if _model:           # already loaded
        return
    print("Loading tokenizer …"); torch.cuda.empty_cache()
    _tokenizer = AutoTokenizer.from_pretrained(BASE, use_fast=True)
    _tokenizer.pad_token = _tokenizer.eos_token
    print("Loading base model …")
    base = AutoModelForCausalLM.from_pretrained(
        BASE,
        device_map = "auto",
        torch_dtype = torch.bfloat16,
        rope_scaling = {"type": "linear", "factor": 8},
        low_cpu_mem_usage = True
    )
    print("Attaching LoRA adapter …")
    _model = PeftModel.from_pretrained(base, ADAPTER).eval()

def generate(prompt: str, max_tokens: int = 350, temperature: float = 0.35) -> str:
    _load_model()
    system_prompt = (
        "<|user|>\n" + prompt.strip() + "\n<|assistant|>\n"
    )
    ids = _tokenizer(system_prompt, return_tensors="pt").to(_model.device)
    with torch.inference_mode():
        out = _model.generate(
            **ids,
            max_new_tokens = max_tokens,
            do_sample      = True,
            temperature    = temperature,
            top_p          = 0.9
        )
    generated = _tokenizer.decode(out[0][ids.input_ids.shape[-1]:],
                                  skip_special_tokens=True)
    return generated.strip()
