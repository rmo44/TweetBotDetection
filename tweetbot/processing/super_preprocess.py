import pandas as pd

# Load your full dataset
df = pd.read_csv("all_50_human_tweets.csv")  # Replace with your filename

# For each Twitter_User_Name, keep only the first 200 tweets
df_limited = df.groupby("Twitter_User_Name").head(1000).reset_index(drop=True)

# Confirm stats
print("✅ Unique bot usernames:", df_limited["Twitter_User_Name"].nunique())
print("✅ Total rows in output:", len(df_limited))

# Save to CSV
df_limited.to_csv("human_limited_1000_per_user.csv", index=False)
