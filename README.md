# Aurora-NLP ![nodejs](https://img.shields.io/badge/nodejs-v16.8.0-blue) ![code quality](https://img.shields.io/badge/code%20quality-A-green) ![building](https://img.shields.io/badge/building-passing-blue)

`aurora-nlpjs` is a project that modifies the entire NLP.js implementation to create conversational contexts. Making it easy to develop and create chatbots that support process, tokenize, categorize intents, and extract text entities in multiple languages. The project supports multiple levels of conversational context through the synthesis of multiple agents.

Currently supporting:

-   Guess the language of a phrase
-   Fast Levenshtein distance of two strings
-   Search the best substring of a string with less Levenshtein distance to a given pattern.
-   Get stemmers and tokenizers for several languages.
-   Sentiment Analysis for phrases (with negation support).
-   Named Entity Recognition and management, multi-language support, and acceptance of similar strings, so the introduced text does not need to be exact.
-   Natural Language Processing Classifier, to classify an utterance into intents.
-   NLP Manager: a tool able to manage several languages, the Named Entities for each language, the utterances, and intents for the training of the classifier, and for a given - utterance return the entity extraction, the intent classification and the sentiment analysis. Also, it is able to maintain a Natural Language Generation Manager for the answers.
-   40 languages natively supported.
-   Any other language is supported through tokenization, even fantasy languages

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

-   [Intent](#intent)
-   [Response](#response)

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
    "utterances": ["Olá", "Oi", "Eai", "Diga"],
    "responses": [
        {
            "parameters": [],
            "message": [
                {
                    "type": "message",
                    "plataform": "telegram",
                    "text": ["Oi, como você está?", "Olá, como você esta?"]
                }
            ]
        }
    ]
}
```

This document represents an intention. It has several tags that help the library process and create the intent responses.

### Example

#### Request

```bash
curl --location --request GET 'localhost:3000/detectIntent?text=olá&sessionId=xbwpe1ns8XyDbQBZ35Jp3r'
```

Session is optional, if passed it is used by the project to determine conversation state in conversational contexts.

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
