from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import os

from services.random_tweet_service import RandomTweetService
from services.text_metrics_service import TextMetricsService

app = Flask(__name__)
CORS(app)

model_path = os.path.join(os.path.dirname(__file__), "bert-twitterbot-detector")
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    # Tokenization
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        confidence, predicted_class = torch.max(probs, dim=1)

    label = "Bot" if predicted_class.item() == 1 else "Human"
    confidence_percent = round(confidence.item() * 100, 2)
    metrics = TextMetricsService.extract_feature_metrics(text)

    return jsonify({
        "prediction": label,
        "confidence": confidence_percent,
        "metrics": metrics,
        "text": text
    })

@app.route("/random-predict", methods=["GET"])
def random_predict():
    tweet, actual_origin = RandomTweetService.get_random_tweet()

    # Tokenization
    inputs = tokenizer(tweet, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        confidence, predicted_class = torch.max(probs, dim=1)

    prediction_label = "Bot" if predicted_class.item() == 1 else "Human"
    confidence_percent = round(confidence.item() * 100, 2)
    metrics = TextMetricsService.extract_feature_metrics(tweet)

    return jsonify({
        "prediction": prediction_label,
        "confidence": confidence_percent,
        "metrics": metrics,
        "text": tweet,
        "actual_origin": actual_origin
    })

if __name__ == "__main__":
    app.run(debug=True)
