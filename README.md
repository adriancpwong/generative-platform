# generative-platform

# Start

docker compose up --build

# Create models directory

mkdir -p services/local-llm-service/models

# Download TinyLlama (1.1B)

python -c "
from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained('TinyLlama/TinyLlama-1.1B-Chat-v1.0', cache_dir='./services/local-llm-service/models')
tokenizer = AutoTokenizer.from_pretrained('TinyLlama/TinyLlama-1.1B-Chat-v1.0', cache_dir='./services/local-llm-service/models')
"

# Download Zephyr (7B) - optional

python -c "
from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained('HuggingFaceH4/zephyr-7b-beta', cache_dir='./services/local-llm-service/models')
tokenizer = AutoTokenizer.from_pretrained('HuggingFaceH4/zephyr-7b-beta', cache_dir='./services/local-llm-service/models')
"

# Rename directories in models as necessary
