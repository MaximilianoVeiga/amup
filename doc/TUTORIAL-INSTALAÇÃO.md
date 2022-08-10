# Tutorial de Instalação AMUP

## Como instalar o AMUP

O AMUP é um software livre, você pode instalá-lo no seu computador.

### Requisitos para Instalação

* **Docker** [Docker](https://www.docker.com/community-edition)
* **Git** [Git](https://git-scm.com/)
* **Node** [Node.js](https://nodejs.org/)
* **NPM** [npm](https://www.npmjs.com/)

### Instalando o AMUP

1. Baixe o [repositorio](https://github.com/MaximilianoVeiga/aurora-nlpjs) no GitHub.

#### Linux

Clone o repositório:

```bash
git clone https://github.com/MaximilianoVeiga/aurora-nlpjs
```

Utilizando o Docker, crie uma nova rede.

```bash
docker network create --subnet=172.10.0.0/16 horizon-network
```

Utilizando o Docker, crie um container para o Redis.

```bash
docker run -d --name amup-redis --network horizon-network -p 6379:6379 redis
```

Utilizando o Docker, crie um container para o AMUP Core.

```bash
docker run -d --name amup-core --network horizon-network -p 3000:3000 thehorizondev/amup:0.0.6
```

Pronto! O AMUP está instalado e funcionando.
