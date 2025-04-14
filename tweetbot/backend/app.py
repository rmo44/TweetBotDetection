import os
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import BertTokenizer, BertForSequenceClassification

from services.text_metrics_service import TextMetricsService
from services.random_tweet_service import RandomTweetService

app = Flask(__name__)
CORS(app)

# === Load BERT model and tokenizer ===
MODEL_PATH = os.path.join(os.path.dirname(__file__), "bert-twitterbot-detector")
tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

def classify_text(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=1)
        confidence, predicted_class = torch.max(probabilities, dim=1)
        label = "Bot" if predicted_class.item() == 1 else "Human"
    return label, confidence.item() * 100

# === Endpoint: Classify user-submitted tweet ===
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    metrics = TextMetricsService.extract_feature_metrics(text)
    prediction, confidence = classify_text(text)

    return jsonify({
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "metrics": metrics,
        "text": text
    })

# === Endpoint: Classify a random tweet from dataset ===
@app.route("/random-predict", methods=["GET"])
def random_predict():
    tweet, actual_origin = RandomTweetService.get_random_tweet()
    if tweet is None:
        return jsonify({"error": "Failed to retrieve tweet"}), 500

    # Run classification
    label, confidence = classify_text(tweet)

    # Extract metrics
    metrics = TextMetricsService.extract_feature_metrics(tweet)

    return jsonify({
        "text": tweet,
        "actual_origin": actual_origin,  # human or bot
        "prediction": label,             # BERT's guess
        "confidence": round(confidence, 2),
        "metrics": metrics
    })


if __name__ == "__main__":
    app.run(debug=True)
