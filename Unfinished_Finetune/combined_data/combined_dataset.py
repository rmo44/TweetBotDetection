import torch
from torch.utils.data import Dataset

# Create a custom dataset holds the tokenized tweets and metrics
class CombinedDataset(Dataset):
    # Tokenize the tweet text.
    # Convert the metrics and labels into tensors. 
    #  PyTorch models only work with tensors
    #  Tensors are a ML data structure that extend vectors and matrices to higher dimensions.
    def __init__(self, texts, metrics, labels, tokenizer):
        self.encodings = tokenizer(texts.tolist(), truncation=True, padding=True, max_length=128, return_tensors="pt")
        self.metrics = torch.tensor(metrics.values, dtype=torch.float32)
        self.labels = torch.tensor(labels.values)

    # Returns how many total tweets are in the dataset 
    #  so it knows when to stop looping.
    def __len__(self):
        return len(self.labels)

    # Return one tweet from the dataset with all the necessary information:
    #  the tokenization ID, mask to ignore padding, metrics, the bot or human label
    def __getitem__(self, idx):
        return {
            "input_ids": self.encodings["input_ids"][idx],
            "attention_mask": self.encodings["attention_mask"][idx],
            "metrics": self.metrics[idx],
            "labels": self.labels[idx]
        }