from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import os

from services.random_tweet_service import RandomTweetService
from services.text_metrics_service import TextMetricsService

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Define the path to the pretrained BERT model and tokenizer
model_path = os.path.join(os.path.dirname(__file__), "bert-twitterbot-detector")
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)

@app.route("/predict", methods=["POST"])
def predict():
    # Get JSON data from request 
    data = request.get_json()
    text = data.get("text", "")

    # Tokenization for BERT to understand
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        confidence, predicted_class = torch.max(probs, dim=1)

    # Interpret prediction (if label is bot or human, and confidence %)
    label = "Bot" if predicted_class.item() == 1 else "Human"
    confidence_percent = round(confidence.item() * 100, 2)
    metrics = TextMetricsService.extract_feature_metrics(text)

    # Return prediction results
    return jsonify({
        "prediction": label,
        "confidence": confidence_percent,
        "metrics": metrics,
        "text": text
    })

@app.route("/random-predict", methods=["GET"])
def random_predict():
    # Get a random tweet and its true label (bot/human)
    tweet, actual_origin = RandomTweetService.get_random_tweet()

    # Just like /predict, this is tokenization for BERT to understand
    inputs = tokenizer(tweet, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        confidence, predicted_class = torch.max(probs, dim=1)

    # Just like /predict, this interprets the prediction (if label is bot or human, and confidence %)
    prediction_label = "Bot" if predicted_class.item() == 1 else "Human"
    confidence_percent = round(confidence.item() * 100, 2)
    metrics = TextMetricsService.extract_feature_metrics(tweet)

    # Return prediction results
    return jsonify({
        "prediction": prediction_label,
        "confidence": confidence_percent,
        "metrics": metrics,
        "text": tweet,
        "actual_origin": actual_origin
    })

if __name__ == "__main__":
    app.run(debug=True)
