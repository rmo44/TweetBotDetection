import pandas as pd
import numpy as np
import re
from textblob import TextBlob
import spacy
from collections import Counter

# Load the spaCy english language model. This is going to help us analyze 
# the features and look for patterns, repetitiveness, and special 
# characteristics we may not have noticed
nlp = spacy.load("en_core_web_sm")

# Function that extracts new features and metrics from a single tweet
def extract_feature_metrics(text):
    features = {}

    # 1. Character and Word counts 
    #  metrics: int >= 0 
    features["char_count"] = len(text)
    features["word_count"] = len(text.split())

    # 2. Special characters: ?, !, #, @, "www.", "http"
    #  metrics: int >= 0 
    features["question_count"] = text.count("?")
    features["exclamation_count"] = text.count("!")
    features["hashtag_count"] = text.count("#")
    features["mention_count"] = text.count("@")
    features["link_count"] = text.lower().count("http") + text.lower().count("www.")

    # 3. Sentiment analysis: polarity and subjectivity
    #  polarity metrics: -1.0 = very negative, 1.0 = very positive
    #  subjectivity metrics: 0.0 = very objective, 1.0 = very subjective 
    blob = TextBlob(text)
    features["polarity"] = blob.sentiment.polarity
    features["subjectivity"] = blob.sentiment.subjectivity

    # 4. Part-of-Speech (POS) ratios: noun, verb, adjective, pronoun
    #  metrics: int >= 0 
    doc = nlp(text)
    pos_counts = Counter([token.pos_ for token in doc])
    total_tokens = len(doc)
    for pos in ["NOUN", "VERB", "ADJ", "ADV", "PRON"]:features[f"{pos.lower()}_ratio"] = pos_counts.get(pos, 0) / total_tokens if total_tokens > 0 else 0
    
    # 5. Lexical diversity: If there are repeated words and the frequency of it
    #  metrics: 0.0 = all words are the same, 1.0 = there are no repeating words
    words = re.findall(r"\b\w+\b", text.lower())
    unique_words = set(words)
    features["unique_word_ratio"] = len(unique_words) / len(words) if words else 0

    # 6. Stop word count: Filler words that humans usually use that bots will omit
    #  metrics: int >= 0 
    stop_words = set(["the", "and", "is", "in", "to", "a", "of", "it", "on", "for"])
    features["stopword_count"] = sum(1 for word in words if word in stop_words)

    return pd.Series(features)

# === THIS IS MAIN ===

# Input the filename --> ex) "filename.csv"
input_filename = "all_50_human_tweets.csv"

# This loads the data set 
df = pd.read_csv(input_filename) 

# Applying new data features and metrics to each row
features_df = df["Tweet_text"].astype(str).apply(extract_feature_metrics)

# Combine the original data with the new metrics data
df_combined = pd.concat([df, features_df], axis=1)

# Generate output filename with 'preprocessed_' in front
output_filename = f"preprocessed_{input_filename}"

# Save to the newly named csv file
df_combined.to_csv(output_filename, index=False)
print(f"Features saved to {output_filename}")