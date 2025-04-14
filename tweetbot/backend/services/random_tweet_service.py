import pandas as pd
import random
from pathlib import Path

class RandomTweetService:
    @staticmethod
    def get_random_tweet():
        base_dir = Path(__file__).resolve().parent.parent
        data_dir = base_dir / "data"

        human_path = data_dir / "clean_human_tweets.csv"
        bot_path = data_dir / "clean_bot_tweets.csv"

        try:
            # Randomly pick bot or human
            if random.random() < 0.5:
                df = pd.read_csv(human_path)
                origin = "human"
            else:
                df = pd.read_csv(bot_path)
                origin = "bot"

            # Fix for byte-encoded strings if necessary
            df["text"] = df["text"].apply(
                lambda t: eval(t).decode("utf-8", errors="ignore") if isinstance(t, str) and t.startswith("b'") else t
            )

            tweet = df.sample(1)["text"].values[0]
            return tweet, origin

        except Exception as e:
            print(f"⚠️ Failed to load or process tweet: {e}")
            return None, None
