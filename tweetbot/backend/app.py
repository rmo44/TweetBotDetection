from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BertTokenizer, BertForSequenceClassification
import torch
from pathlib import Path

from services.text_metrics_service import TextMetricsService  # NEW

app = Flask(__name__)
CORS(app)

# === Load local model and tokenizer ===
MODEL_DIR = Path(__file__).resolve().parent / "bert-twitterbot-detector"

tokenizer = BertTokenizer.from_pretrained(str(MODEL_DIR))
model = BertForSequenceClassification.from_pretrained(str(MODEL_DIR))
model.eval()

# Move model to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "No input text provided"}), 400

    # Tokenize input
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Run prediction
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1).squeeze().tolist()
        predicted_class = torch.argmax(outputs.logits, dim=1).item()

    label = "Bot" if predicted_class == 1 else "Human"
    confidence = round(probs[predicted_class] * 100, 2)

    # Extract metrics
    metrics = TextMetricsService.extract_metrics(text)  # NEW

    return jsonify({
        "prediction": label,
        "confidence": confidence,
        "metrics": metrics  # NEW
    })

if __name__ == "__main__":
    app.run(debug=True)
