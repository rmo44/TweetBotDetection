import pandas as pd
import torch
import os
from torch.utils.data import DataLoader
from transformers import BertTokenizer, AdamW
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, precision_recall_fscore_support
from tqdm import tqdm
from model.bert_with_metrics import BertWithMetrics
from combined_data.combined_dataset import CombinedDataset

# Read in the preprocessed data (one for human, one for bots).
# Add a new column to each csv: 0 = human, 1 = bot.
# Combine both data sets and shuffle the rows up.
df_human = pd.read_csv("preprocessed_human_limited_1000_per_user.csv")
df_bot = pd.read_csv("preprocessed_bots_limited_1000_per_user.csv")
df_human["label"] = 0
df_bot["label"] = 1
df = pd.concat([df_human, df_bot]).sample(frac=1, random_state=42).reset_index(drop=True)

# Grab the tweet text as strings to be tokenized later. 
# Define the list of metric columns made during the preprocess.
# Extract the metric values and label value.
text_col = df["Tweet_text"].astype(str)
metric_cols = [
    "char_count", "word_count", "question_count", "exclamation_count", "hashtag_count",
    "mention_count", "link_count", "polarity", "subjectivity",
    "noun_ratio", "verb_ratio", "adj_ratio", "adv_ratio", "pron_ratio",
    "unique_word_ratio", "stopword_count"
]
metrics = df[metric_cols]
labels = df["label"]

# We let the model train on 80% of the data and test itself on the other 20%.
train_texts, val_texts, train_metrics, val_metrics, train_labels, val_labels = train_test_split(
    text_col, metrics, labels, test_size=0.2, random_state=42
)

# Tokenize the tweets so BERT understands.
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# Wrap the text, metrics, and labels into our CombinedDataset class.
# 'DataLoader' will feed the data in small batches of 8.
train_dataset = CombinedDataset(train_texts, train_metrics, train_labels, tokenizer)
val_dataset = CombinedDataset(val_texts, val_metrics, val_labels, tokenizer)
train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=8)

# Initialize our custom BERT model and how many metrics there are.
# Pick the GPU if available (cause its faster) if not just use CPU.
# Move the model to the device so its ready to train.
# 'Optimizer' controls how the model adjust itself during training
#   It helps the model improve by adjusting its weights based on its mistakes.
# 'Criterion' measures how off the predictions are from the true answer. 
model = BertWithMetrics(metric_dim=16)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
optimizer = AdamW(model.parameters(), lr=2e-5)
criterion = torch.nn.CrossEntropyLoss()

# Training!!!
# Epoch means loop so we are going through the training process 3 times.
# We go through all the training data one batch at a time, tokenize the text,tell BERT 
#  which parts of the input to ignore, and add our metrics and human/bot labels. 
# Starting from 'optimizer' we reset the past learning steps (gradients), make a
#  prediction, calculate the error (loss), figure out how to adjust the model(backpropagation),
#  and then apply those adjustments. 
model.train()
for epoch in range(3):
    print(f"\nEpoch {epoch+1}")
    for batch in tqdm(train_loader):
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        metrics = batch["metrics"].to(device)
        labels = batch["labels"].to(device)

        optimizer.zero_grad()
        logits = model(input_ids=input_ids, attention_mask=attention_mask, metrics=metrics)
        loss = criterion(logits, labels)
        loss.backward()
        optimizer.step()

# Evaluation!!!
# Switch the model to evaluation mode.
# Store the true and predicted labels.
# We repeat the same steps from training but without adjusting the model.
# Starting from 'predictions' choose the label with the highest score.
# Store the true and predicted labels. 
model.eval()
y_true, y_pred = [], []

with torch.no_grad():
    for batch in val_loader:
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        metrics = batch["metrics"].to(device)
        labels = batch["labels"].to(device)

        logits = model(input_ids=input_ids, attention_mask=attention_mask, metrics=metrics)
        predictions = torch.argmax(logits, dim=1)
        y_true.extend(labels.cpu().numpy())
        y_pred.extend(predictions.cpu().numpy())

# Show how well the model performed 
print("\nClassification Report:")
print(classification_report(y_true, y_pred, target_names=["Human", "Bot"]))

# Save the model!!!
# Create a folder to save the model if it doesn't exist yet.
# Save the newly trained model.
# Save the tokenization for the Flask frontend.
model_dir = "bert-twitterbot-detector"
os.makedirs(model_dir, exist_ok=True)
model.save_pretrained(model_dir)
tokenizer.save_pretrained(model_dir)