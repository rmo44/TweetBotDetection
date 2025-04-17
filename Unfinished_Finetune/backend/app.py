from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import BertTokenizer
import os
from model.bert_with_metrics import BertWithMetrics

# --->>> IMPORTANT: Assume that the folder "backend" has all the necessary folders and files 
# that the working demo backend has. 

app = Flask(__name__)
CORS(app)

# Here we load our new finetune model trained on metrics and tokenizer
# We also initiate our model with the correct number of metrics
# load the weights saved from the training and then set our model to 
# the evaluation state. 
model_path = os.path.join(os.path.dirname(__file__), "bert-twitterbot-detector")
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertWithMetrics(metric_dim=16)
model.load_state_dict(torch.load(os.path.join(model_path, "pytorch_model.bin"), map_location=torch.device("cpu")))
model.eval()

# Define the 16 metrics like they are in our data
metric_keys = [
    "char_count", "word_count", "question_count", "exclamation_count", "hashtag_count",
    "mention_count", "link_count", "polarity", "subjectivity",
    "noun_ratio", "verb_ratio", "adj_ratio", "adv_ratio", "pron_ratio",
    "unique_word_ratio", "stopword_count"
]

# Helper function to convert metrics to tensor format for the model
#  PyTorch models only work with tensors
#  Tensors are a ML data structure that extend vectors and matrices to higher dimensions.
def get_metrics_tensor(text):
    metrics = TextMetricsService.extract_feature_metrics(text)
    return torch.tensor([metrics[k] for k in metric_keys], dtype=torch.float32).unsqueeze(0)

# API route:  when the frontend sends a POST request to /predict this function will run
# Make a prediction without tracking gradients (faster + no training).
@app.route("/predict", methods=["POST"])
# Get the tweet text from the request and default to an empty string if there is no request. 
# Tokenize the tweet for BERT input.
# Convert metrics to tensors. 
def predict():
    data = request.get_json()
    text = data.get("text", "")
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    metrics_tensor = get_metrics_tensor(text)

    # Make a predictions without tracking gradients(past learning steps).
    # Turn a vector of real numbers into a probability(softmax).
    # Pick the label with the highest score. 
    with torch.no_grad():
        logits = model(input_ids=inputs["input_ids"], attention_mask=inputs["attention_mask"], metrics=metrics_tensor)
        probs = torch.nn.functional.softmax(logits, dim=1)
        confidence, predicted_class = torch.max(probs, dim=1)

    # Convert prediction to a one of the labels bot or human.
    # Turn confidence percentage into a number. 
    # Return metrics for display
    label = "Bot" if predicted_class.item() == 1 else "Human"
    confidence_percent = round(confidence.item() * 100, 2)
    metrics = TextMetricsService.extract_feature_metrics(text)

    # Send result back to frontend as a JSON response
    return jsonify({
        "prediction": label,
        "confidence": confidence_percent,
        "metrics": metrics,
        "text": text
    })

if __name__ == "__main__":
    app.run(debug=True)