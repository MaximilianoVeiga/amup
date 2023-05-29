# AMUP ![nodejs](https://img.shields.io/badge/nodejs-v16.8.0-blue) ![code quality](https://img.shields.io/badge/code%20quality-A-green) ![building](https://img.shields.io/badge/building-passing-blue)

`AMUP - Artificial Machine Understanding Platform` é um projeto que modifica toda a implementação do NLP.js para criar contextos conversacionais. Facilitando o desenvolvimento e a criação de chatbots que oferecem suporte a processos, tokenização, categorização de intenções e extração de entidades de texto em vários idiomas. O projeto oferece suporte a vários níveis de contexto conversacional por meio da síntese de vários agentes.

Atualmente apoiando:

-   Adivinhe o idioma de uma frase
-   Distância levenshtein rápida de duas cordas
-   Pesquise a melhor substring de uma string com menos distância de Levenshtein para um determinado padrão.
-   Obtenha lematizadores e tokenizadores para vários idiomas.
-   Análise de sentimento para frases (com suporte de negação).
-   Reconhecimento e gerenciamento de entidades nomeadas, suporte a vários idiomas e aceitação de strings semelhantes, portanto, o texto introduzido não precisa ser exato.
-   Classificador de processamento de linguagem natural, para classificar um enunciado em intenções.
-   NLP Manager: uma ferramenta capaz de gerenciar vários idiomas, as Entidades Nomeadas para cada idioma, os enunciados e intenções para o treinamento do classificador e, para um determinado enunciado, retornar a extração da entidade, a classificação da intenção e a análise do sentimento. Além disso, é capaz de manter um Gerenciador de Geração de Linguagem Natural para as respostas.
-   40 idiomas suportados nativamente.
-   Qualquer outro idioma é suportado por tokenização, mesmo idiomas de fantasia

## Instalação

Clonar projeto

```console
git clone github.com/maximilianoveiga/aurora-nlpjs
```

Instalar dependências

```console
npm install
```

## Uso

### Conteúdo

-   [Intenção](#intenção)
-   [Resposta](#resposta)

### Intenção

```json
{
    "id": "QzsqN5RrljKxCdyBq1iacz",
    "name": "Welcome Intent",
    "slug": "welcome",
    "webhookUsed": false,
    "fallbackIntent": false,
    "endInteraction": false,
    "priority": 500000,
    "utterances": [
        "Olá",
        "Oi",
        "Eaí",
        "Eae",
        "Bom dia",
        "Boa tarde",
        "Boa noite"
    ],
    "inputContexts": [],
    "outputContexts": [],
    "responses": [
        {
            "parameters": [],
            "message": [
                {
                    "type": "message",
                    "platform": "telegram",
                    "text": [
                        "Olá, $name! Seja bem-vindo(a) ao chatbot! Como posso te ajudar hoje?"
                    ]
                }
            ]
        }
    ]
}
```

Este documento representa uma intenção. Possui várias tags que ajudam a biblioteca a processar e criar as respostas de intenção.

### Exemplo

#### Requisição

```bash
curl --location --request GET 'localhost:3000/detectIntent?text=olá&sessionId=xbwpe1ns8XyDbQBZ35Jp3r'
```

A sessão é opcional, se informada, é usada pelo projeto para determinar o estado da conversa em contextos de conversação.

### Resposta

```json
{
    "id": "oSU8T5Hsp6oH8JMdiDMEVN",
    "endInteraction": false,
    "fulfillmentText": "Olá, Max! Seja bem-vindo(a) ao chatbot! Como posso te ajudar hoje?",
    "utterance": "Olá!",
    "languageCode": "br",
    "confidence": 1,
    "entities": [],
    "webhook": {
        "webhookUsed": false
    },
    "parameters": {},
    "inputContexts": [],
    "outputContexts": [],
    "messages": [
        {
            "text": "Olá, Max! Seja bem-vindo(a) ao chatbot! Como posso te ajudar hoje?"
        }
    ],
    "sentimentAnalysisResult": {
        "queryTextSentiment": {
            "score": 0,
            "type": "afinn",
            "vote": "neutral"
        }
    },
    "intent": {
        "isFallback": false,
        "displayName": "Welcome Intent",
        "endInteraction": false,
        "id": "rDXkEvyke4rDLg15dbyFdy"
    }
}
```
