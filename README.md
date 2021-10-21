# Aurora-NLP ![nodejs](https://img.shields.io/badge/nodejs-v16.8.0-blue) ![code quality](https://img.shields.io/badge/code%20quality-A-green) ![building](https://img.shields.io/badge/building-passing-blue)

`aurora-nlpjs` is a project that implements NLP.js with express to process, tokenize, categorize intents, and extract text entities in multiple languages.

You can find more information here: [NLP.js documentation](https://github.com/axa-group/nlp.js/).

## Installation

Clone project

```console
git clone github.com/maximilianoveiga/aurora-nlpjs
```

Install dependencies

```console
npm install
```

## Usage

### Contents

* [Intent](#intent)
* [Response](#tokenizing)

### Intent

```json
{
  "name": "Welcome Intent",
  "slug": "welcome",
  "fallbackIntent": false,
  "endInteraction": false,
  "priority": 500000,
  "context": "",
  "tests": ["Olá, tudo bem?", "Oi, tudo bem?"],
  "utterances": ["Olá", "Oi", "Eai", "Diga"],
  "responses": [
    {
      "parameters": [],
      "message": [
        {
          "type": "message",
          "condition": "",
          "text": ["Oi, como você está?", "Olá, como você esta?"]
        }
      ]
    }
  ]
}

```

This document represents an intention. It has several tags that help the library process and create the intent responses.

### Response


```json
{
    "locale": "pt",
    "utterance": "ola",
    "languageGuessed": false,
    "localeIso2": "pt",
    "language": "Portuguese",
    "explanation": [
        {
            "token": "",
            "stem": "##exact",
            "weight": 1
        }
    ],
    "classifications": [
        {
            "intent": "welcome",
            "score": 1
        },
        {
            "intent": "end",
            "score": 0
        }
    ],
    "intent": "welcome",
    "score": 1,
    "domain": "default",
    "sourceEntities": [],
    "entities": [],
    "answers": [
        {
            "answer": "Oi, como você está?"
        },
        {
            "answer": "Olá, como você esta?"
        }
    ],
    "answer": "Oi, como você está?",
    "actions": [],
    "sentiment": {
        "score": 0,
        "numWords": 1,
        "numHits": 0,
        "average": 0,
        "type": "afinn",
        "locale": "pt",
        "vote": "neutral"
    }
}
```
