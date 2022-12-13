# AMUP Installation Tutorial

## Introduction

AMUP is free software, you can install it on your computer.

### Installation Requirements

* **Docker** [Docker](https://www.docker.com/community-edition)
* **Git** [Git](https://git-scm.com/)
* **Node** [Node.js](https://nodejs.org/)
* **NPM** [npm](https://www.npmjs.com/)

### Installing AMUP

1. Download the [repository](https://github.com/MaximilianoVeiga/aurora-nlpjs) on GitHub.

#### Linux and Windows

Clone the repository:

```bash
git clone https://github.com/MaximilianoVeiga/aurora-nlpjs
```

Using Docker, create a new network.

```bash
docker network create --subnet=172.10.0.0/16 horizon-network
```

Using Docker, create a container for Redis.

```bash
docker run -d --name amup-redis --network horizon-network -p 6379:6379 redis
```

Using Docker, create a container for AMUP Core.

```bash
docker run -d --name amup-core --network horizon-network -p 3000:3000 thehorizondev/amup:0.0.6
```

Ready! AMUP is up and running.
