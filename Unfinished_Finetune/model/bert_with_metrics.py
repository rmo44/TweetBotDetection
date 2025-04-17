import torch
import torch.nn as nn
from transformers import BertModel

# We need to make a neural network that combines BERT with our additional metrics
class BertWithMetrics(nn.Module):
    # Load in the pretrained BERT model.
    # Use dropout technique (randomly drop parts of the data during training)
    #  to try and avoid overfitting (when the model memorizes the data rather
    #  then generalizing[make accurate predictions] new data).
    # The 'self.classifier' on line takes the info from BERT (that understands the tweet) 
    #  and combines it with the metrics we found in the tweet (like how many hashtags or question marks it has).
    #  To make a final decision, it squeezes all the information down to a smaller size (nn.Linear(768...))
    #  adds logic(nn.ReLU()) so the model can learn more complex patterns, use more dropout to not memorize the answer.
    #  It gives two scores, a confidence score of if its a bot and if its a human. 
    def __init__(self, metric_dim, dropout_rate=0.3):
        super(BertWithMetrics, self).__init__()
        self.bert = BertModel.from_pretrained("bert-base-uncased")
        self.dropout = nn.Dropout(dropout_rate)
        self.classifier = nn.Sequential(  
            nn.Linear(768 + metric_dim, 128), 
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(128, 2)
        )

    # How data is handled in the model.
    # Pass the tokenized tweet through BERT.
    # From BERT's output we take the part that summarizes the whole tweet (the CLS token).
    #   This gives us one main vector that captures the overall meaning of the tweet.
    # Combine that summary from BERT with the metrics
    # Apply drop out to avoid memorizing exact patterns from training data
    # Send everything back too the final decision and return that answer
    def forward(self, input_ids, attention_mask, metrics):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        cls_output = outputs.last_hidden_state[:, 0, :]  # CLS token
        combined = torch.cat((cls_output, metrics), dim=1)
        combined = self.dropout(combined)
        logits = self.classifier(combined)
        return logits