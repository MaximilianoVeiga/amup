# How to use AMUP

## Introduction

In this tutorial, we will demonstrate how to use AMUP to build a conversational agent. But first, it will be necessary to install the AMUP. To do so, access the [installation tutorial](instalacao.md).

### Creating a new conversational agent

To create a new conversational agent, it is first necessary to make a POST request with the intent payload. For example:

```bash
curl --location --request POST 'localhost:3000/api/intent' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Max Intent",
  "fallbackIntent": false,
  "endInteraction": false,
  "priority": 500000,
  "utterances": [
    "sou o max"
  ],
  "inputContexts": [],
  "outputContexts": [],
  "responses": [
    {
      "parameters": [],
      "message": [
        {
          "type": "message",
          "platform": "webchat",
          "text": [
            "Olá, Maximiliano!"
          ]
        }
      ]
    }
  ]
}'
```

The above payload will create an intent with the name "Max Intent" and the response "Hello Maximilian!". For more information about the payload, go to the [intent documentation](intent.md).
