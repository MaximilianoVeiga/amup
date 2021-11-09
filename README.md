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
* [Response](#response)

### Intent

```json
{
  "name": "Welcome Intent",
  "slug": "welcome",
  "action": "welcome",
  "fallbackIntent": false,
  "endInteraction": false,
  "priority": 500000,
  "context": "",
  "utterances": [
    "Olá",
    "Oi",
    "Eai",
    "Diga"
  ],
  "responses": [
    {
      "parameters": [],
      "message": [
        {
          "type": "message",
          "plataform": "webchat",
          "text": [
            "Oi, como você está?",
            "Olá, como você esta?"
          ]
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
  "id": "gfp5t6FUa6XEQYaPFAKe4a",
  "fulfillmentText": "Oi, como você está?",
  "utterance": "olá, tudo bem?",
  "languageCode": "pt",
  "confidence": 1,
  "entities": [],
  "webhook": {
    "webhookUsed": false
  },
  "messages": [
    {
      "text": "Oi, como você está?"
    }
  ],
  "sentimentAnalysisResult": {
    "queryTextSentiment": {
      "score": 3,
      "type": "afinn",
      "vote": "positive"
    }
  },
  "intent": {
    "isFallback": false,
    "displayName": "Welcome Intent",
    "id": "fGCUztXn1WMDNkN6i4gqVA"
  }
}
```