import re
import pandas as pd
from textblob import TextBlob
import spacy

nlp = spacy.load("en_core_web_sm")

class TextMetricsService:
    @staticmethod
    def extract_feature_metrics(text):
        features = {}

        # Basic text stats
        features["char_count"] = len(text)
        features["word_count"] = len(text.split())
        features["avg_word_length"] = features["char_count"] / (features["word_count"] or 1)

        # Special characters
        features["exclamation_count"] = text.count("!")
        features["hashtag_count"] = text.count("#")
        features["mention_count"] = text.count("@")
        features["link_count"] = len(re.findall(r"http[s]?://\S+", text))

        # Sentiment polarity
        blob = TextBlob(text)
        features["sentiment_polarity"] = blob.sentiment.polarity

        # POS tag counts
        doc = nlp(text)
        pos_counts = doc.count_by(spacy.attrs.POS)
        for pos_id, count in pos_counts.items():
            pos = doc.vocab[pos_id].text
            features[f"pos_{pos.lower()}_count"] = count

        return features