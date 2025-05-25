# Como utilizar o AMUP

## Introdução

Neste tutorial, iremos demonstrar como utilizar o AMUP para construção de um agente conversacional. Porém antes, será necessário instalar o AMUP. Para isso, acesse o [tutorial de instalação](instalacao.md).

### Criando um novo agente conversacional

Para criar um novo agente conversacional, primeiro é necessário realizar um requisição do tipo POST com o payload da intenção. Por exemplo:

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

O payload acima irá criar uma intenção com o nome "Max Intent" e a resposta "Olá, Maximiliano!". Para mais informações sobre o payload, acesse a [documentação sobre intenções](intent.md).
