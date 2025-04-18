# Twitter Bot Detector

This project is a full-stack web application that uses a fine-tuned BERT model to classify whether a tweet or social media post was generated by a human or a bot.

Built using:
- HuggingFace Transformers + PyTorch (backend)
- Flask API for model serving
- React for the frontend UI

## Demo

<img src="screenshot.png" alt="Bot Detector UI Screenshot" width="600"/>

To see the demo in action, enter a sample tweet into the input field and observe the classification results displayed below the form. The prediction will indicate whether the text is likely from a human or a bot, along with a confidence score.

## Features

- Input any tweet or post and classify it as "Human" or "Bot"
- Displays prediction confidence from the fine-tuned BERT model
- Full local model execution — no external API calls required
- Simple, clean user interface built with React and Tailwind CSS
- Flask backend serves the model and handles prediction requests

## Project Structure

TwitterBotDetector/ ├── backend/ # Flask backend and model │ ├── app.py # API endpoint for predictions │ └── bert-twitterbot-detector/ │ ├── config.json │ ├── model.safetensors │ ├── tokenizer_config.json │ ├── special_tokens_map.json │ └── vocab.txt │ ├── frontend/ # React frontend UI │ ├── src/ │ │ ├── App.js │ │ ├── BotDetector.jsx │ │ └── index.js │ └── public/ │ └── index.html │ ├── requirements.txt # Python dependencies for backend └── README.md # Project documentation

## Setup Instructions

### 1. Clone the repository
- git clone https://github.com/rmo44/TweetBotDetection.git
- cd TweetBotDetection

### 2. Important file set up
- A piece of our model file was too big to upload onto Github
- Please download the model.zip(https://drive.google.com/drive/u/0/folders/1h1PCA3mzvq7tGFqirsWbrRIiYEqljWGE) file from google drive and save it under the following folder: bert-twitterbot-detector
- This is the file path to that folder:TweetBotDetection/tweetbot/backend/bert-twitterbot-detector


### 3. Set up the Python backend (using Conda recommended)
- cd backend
- (Windows Only): open a powershell terminal
- (Mac Only): open a zsh terminal
- conda create -n botdetector python=3.10 -y
- conda activate botdetector
- pip install -r ../requirements.txt
- python -m spacy download en

Then run the Flask API server:
- python app.py

### 4. Set up the React frontend
Open a new terminal window or tab:
- cd frontend
- npm install
- npm install axios
- npm start

## BERT Model Details

The classification model used in this project is a fine-tuned version of `bert-base-uncased` from HuggingFace. It has been trained specifically to distinguish between human-written and bot-generated social media posts.
BERT is a transformers model pretrained on a large corpus of English data in a self-supervised fashion.
This means it was pretrained on the raw texts only, with no humans labeling them in any way (which is why it can use lots of publicly available data) with an automatic process to generate inputs and labels from those texts. More precisely, it was pretrained with two objectives:

- Masked language modeling (MLM): taking a sentence, the model randomly masks 15% of the words in the input then run the entire masked sentence through the model and has to predict the masked words. This is different from traditional recurrent neural networks (RNNs) that usually see the words one after the other, or from autoregressive models like GPT which internally masks the future tokens. It allows the model to learn a bidirectional representation of the sentence.

- Next sentence prediction (NSP): the models concatenates two masked sentences as inputs during pretraining. Sometimes they correspond to sentences that were next to each other in the original text, sometimes not. The model then has to predict if the two sentences were following each other or not.
  
Model characteristics:
- Architecture: `BertForSequenceClassification`
- Task: Binary classification (`Human` = 0, `Bot` = 1)
- Max token length: 128
- Tokenizer: BERT tokenizer with standard `[CLS]`, `[SEP]`, and `[PAD]` tokens

All model weights and tokenizer configuration files are stored locally in the `backend/bert-twitterbot-detector/` directory. No internet access is required at runtime.

## Example Input

You can test the classifier by entering any tweet-style text. Here's an example:

**Input:**
Just had an amazing dinner with friends! #blessed

**Output:**
- Prediction: Human  
- Confidence: 96.42%

Another example:

**Input:**
Check out our new crypto investment platform! Get rich quick: http://scam.link

**Output:**
- Prediction: Bot  
- Confidence: 92.10%

## .gitignore Best Practices

The repository includes a `.gitignore` file to prevent unnecessary or large files from being tracked by Git. This helps keep the repository lightweight and ensures only the essential source code and configuration files are committed.

Ignored files and directories include:

- `frontend/node_modules/` — local frontend dependencies
- `.conda/`, `env/`, `venv/` — local virtual environments
- `*.safetensors`, `*.bin`, `*.pth` — large model weight files
- `.DS_Store`, `Thumbs.db` — OS-generated junk files
- `.vscode/`, `.idea/` — editor-specific settings

## To Do / Possible Extensions

This project provides a solid base for bot detection using NLP, but there are several enhancements that can be made:

- [ ] Integrate live Twitter scraping for real-time detection
- [ ] Deploy backend and frontend using Docker or Render
- [ ] Display attention visualizations or model explainability (e.g., SHAP or LIME)

## License

This project is open source and available under the [MIT License](LICENSE).

You are free to use, modify, and distribute this software for personal or commercial purposes, provided that the original license terms are respected.

## Authors

**Jordan Burgess** **Rose Ochoa** **Ross Terrazas** **James Cowley** **Nick Esteves** 
Developed as part of a System Security course project at Texas State University.


## Acknowledgements

This project was made possible by the following open-source tools and frameworks:

- [HuggingFace Transformers](https://huggingface.co/transformers) — for model architecture and tokenizer support
- [HuggingFace Model](https://huggingface.co/google-bert/bert-base-uncased) - for specific model use and pre-training information
- [PyTorch](https://pytorch.org) — for training and model inference
- [Flask](https://flask.palletsprojects.com) — for serving the backend API
- [Flask-CORS](https://flask-cors.readthedocs.io) — for enabling cross-origin requests
- [React](https://reactjs.org) — for building the frontend interface
- [Create React App](https://create-react-app.dev) — for initializing the frontend project

## References
- Foundational Paper: Alarfaj, F. K., Ahmad, H., Khan, H. U., Alomair, A. M., Almusallam, N., & Ahmed, M. (2023). Twitter bot detection using diverse content features and applying machine learning algorithms. Sustainability, 15(8), 6662.
- Contemporary Paper: Hannousse, A., & Talha, Z. (2024). A Hybrid Ensemble Learning Approach for Detecting Bots on Twitter. International Journal of Performability Engineering, 20(10).
