import pandas as pd
from pathlib import Path

def extract_text_column(input_file, output_file, column_name="Tweet_text"):
    try:
        df = pd.read_csv(input_file)

        if column_name not in df.columns:
            raise ValueError(f"'{column_name}' column not found in {input_file}")

        # Drop NA and rename to 'text'
        text_only_df = df[[column_name]].dropna()
        text_only_df.columns = ["text"]

        text_only_df.to_csv(output_file, index=False)
        print(f"✅ Saved {len(text_only_df)} tweets to {output_file}")

    except Exception as e:
        print(f"❌ Error processing {input_file}: {e}")

if __name__ == "__main__":
    current_dir = Path(__file__).resolve().parent

    input_output_map = {
        "preprocessed_human_limited_10_per_user.csv": "clean_human_tweets.csv",
        "preprocessed_bots_limited_10_per_user.csv": "clean_bot_tweets.csv"
    }

    for input_name, output_name in input_output_map.items():
        input_path = current_dir / input_name
        output_path = current_dir / output_name
        extract_text_column(input_path, output_path)
