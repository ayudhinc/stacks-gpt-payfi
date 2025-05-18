from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM, AutoTokenizer,
    TrainingArguments, BitsAndBytesConfig, DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model

BASE_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct"
PAIRS_PATH = "dataset-raw/instruct_pairs.jsonl"
OUTPUT_DIR = "payfi-copilot-lora"

print("▶ loading dataset")
ds = load_dataset("json", data_files=PAIRS_PATH, split="train")

def to_sft(batch):
    return {
        "text": "<|user|>\n"  + batch["prompt"]   + "\n<|assistant|>\n" +
                batch["response"] + "<|end_of_turn|>"
    }
ds = ds.map(to_sft, remove_columns=ds.column_names)

print("▶ loading base model + tokenizer")
bnb_cfg = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_compute_dtype="bfloat16",
)
tok = AutoTokenizer.from_pretrained(BASE_MODEL)
tok.pad_token = tok.eos_token
model = AutoModelForCausalLM.from_pretrained(BASE_MODEL,
                                             quantization_config=bnb_cfg,
                                             rope_scaling={"type": "linear", "factor": 8})

lora_cfg = LoraConfig(r=32, lora_alpha=32, lora_dropout=0.05,
                      target_modules=["q_proj", "k_proj", "v_proj", "o_proj"])
model = get_peft_model(model, lora_cfg)

print("▶ training")
args = TrainingArguments(
    OUTPUT_DIR, num_train_epochs=3, per_device_train_batch_size=4,
    gradient_accumulation_steps=4, learning_rate=2e-4,
    fp16=True, logging_steps=50, save_steps=250, report_to=[]
)
trainer = transformers.Trainer(
    model=model, args=args, train_dataset=ds,
    data_collator=DataCollatorForLanguageModeling(tok, mlm=False)
)
trainer.train()
model.save_pretrained(OUTPUT_DIR)
print("✅ LoRA adapter stored in", OUTPUT_DIR)
