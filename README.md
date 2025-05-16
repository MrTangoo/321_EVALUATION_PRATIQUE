
# E-Commerce Microservices – Évaluation Module 321

Projet réalisé dans le cadre de l'évaluation pratique du module **321 – Programmer des systèmes distribués**  
**EPSIC 2025**

---

## Fonctionnalités en bref

### Application globale
Cette application e-commerce repose sur une architecture microservices avec API Gateway, messagerie et déploiement Swarm.  
Chaque service est indépendant, conteneurisé et interagit avec les autres via HTTP ou RabbitMQ.

### Service 1 : `catalogue` (FastAPI)
- Ajouter des produits avec nom et prix
- Lister tous les produits
- Documentation Swagger auto-générée
- Base de données locale : SQLite

### Service 2 : `commandes` (Express.js)
- Créer des commandes client (produit, quantité)
- Liste des commandes passées
- Utilise PostgreSQL comme base de données
- Publie chaque commande via RabbitMQ (fanout)

---

## Architecture et technologies utilisées

| Composant      | Technologie          |
|----------------|----------------------|
| API Gateway    | Traefik v2           |
| Microservice 1 | FastAPI (Python) + SQLite |
| Microservice 2 | Express (Node.js) + PostgreSQL |
| Messagerie     | RabbitMQ (Pub/Sub)   |
| Conteneurs     | Docker               |
| Orchestration  | Docker Compose + Docker Swarm |

---

## Installation & exécution

### 1. Pré-requis
- Docker Desktop 
- Docker Compose
- Accès administrateur pour modifier `hosts`

### 2. Modifier le fichier `hosts`

Ouvre `C:\Windows\System32\drivers\etc\hosts` en administrateur et ajoute à la fin :

```
127.0.0.1 catalogue.localhost
127.0.0.1 commandes.localhost
```

### 3. Lancer l'application

```bash
docker-compose up --build
```

### 4. Lancer avec Docker Swarm (objectif 3b)

```bash
docker swarm init
docker build -t catalogue:latest ./catalogue
docker build -t commandes:latest ./commandes
docker stack deploy -c swarm-deploy/docker-stack.yml ecommerce
```

Vérifie le déploiement :

```bash
docker service ls
```

---

## URLs utiles

| Service                | URL                                     |
|------------------------|------------------------------------------|
| Swagger – catalogue    | http://catalogue.localhost/docs         |
| API – catalogue        | http://catalogue.localhost/products     |
| API – commandes        | http://commandes.localhost/orders       |
| UI – Traefik Dashboard | http://localhost:8080                   |
| UI – RabbitMQ          | http://localhost:15672 (user/pass: guest) |

---

## [3a] RabbitMQ – Description d'utilisation

- **Pattern utilisé** : **Publish / Subscribe** via un exchange de type fanout
- **Service commandes** publie un message JSON { product, quantity } à chaque commande
- RabbitMQ permet ici de découpler la logique de traitement (ex: stock, notification) du service principal
- L'intégration est réalisée via la bibliothèque amqplib (Node.js)
- Ce message pourrait être consommé par un autre microservice non-couplé (ex : gestion de stock automatisée)

---


## Équipe projet
- Maxime Derbigny & Valentin Roth
