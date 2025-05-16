
# 🛒 E-Commerce Microservices App

Projet de l’évaluation pratique – **Systèmes distribués**  
EPSIC – 2024/2025 – Veronica Getaz

## 🧩 Microservices

Cette application simule un petit système e-commerce composé de deux microservices :

| Microservice | Description                    | Techno            | Base de données |
|--------------|--------------------------------|--------------------|------------------|
| Catalogue    | Gestion des produits           | FastAPI (Python)   | SQLite           |
| Commandes    | Enregistrement des commandes   | Express (Node.js)  | PostgreSQL       |

Les services communiquent via HTTP REST et utilisent aussi **RabbitMQ** (pattern Publish/Subscribe).

## 🧰 Technologies principales

- **Python 3.11**, **FastAPI**, **SQLite**
- **Node.js 18**, **Express.js**, **PostgreSQL**
- **RabbitMQ** (broker de messages)
- **Docker Compose** (déploiement local)
- **Docker Swarm** (déploiement distribué)
- **Traefik v2** (API Gateway + dashboard)

---

## 📦 Structure du projet

```
ecommerce-app/
├── catalogue/         # Microservice catalogue (FastAPI)
├── commandes/         # Microservice commandes (Express)
├── traefik/           # Configuration API Gateway (Traefik)
├── swarm-deploy/      # Fichiers de déploiement Docker Swarm
├── docker-compose.yml
├── README.md
```

---

## 🚀 Installation & exécution locale

### 1. Pré-requis
- Docker + Docker Compose
- Fichier hosts mis à jour si nécessaire :
  ```bash
  sudo nano /etc/hosts
  ```
  Ajouter :
  ```
  127.0.0.1 catalogue.localhost
  127.0.0.1 commandes.localhost
  ```

### 2. Lancer les services

```bash
docker-compose up --build
```

---

## 🌐 URLs utiles

| Service        | URL                                    |
|----------------|----------------------------------------|
| API catalogue  | http://catalogue.localhost/products |
| API commandes  | http://commandes.localhost/orders     |
| Swagger UI     | http://catalogue.localhost/docs         |
| Traefik UI     | http://localhost:8080                             |
| RabbitMQ UI    | http://localhost:15672 (user/pass: guest)   |

---

## 📨 RabbitMQ – Pattern Pub/Sub

**Objectif :** envoyer un message à chaque commande passée.

- **Publisher** : `commandes` publie chaque commande sur `orderExchange`.
- **Exchange** : type `fanout` (broadcast).
- **Consumer (à ajouter)** : autre service ou traitement simulant par ex. la gestion de stock.
- **Avantage** : découplage fort, scalabilité.

📄 Voir : `commandes/index.js` pour la publication RabbitMQ.

---

## ☁️ Déploiement avec Docker Swarm

### 1. Initialiser le Swarm

```bash
docker swarm init
```

### 2. Déployer l'application

```bash
docker stack deploy -c swarm-deploy/docker-stack.yml ecommerce
```

### 3. Vérifier les services

```bash
docker service ls
```

🖼 Optionnel : utiliser Swarm Visualizer  
🔍 Vérifier sur [Play with Docker](https://labs.play-with-docker.com/)

---

## ✅ Fonctionnalités en bref

- Création et affichage de produits (`catalogue`)
- Création et affichage de commandes (`commandes`)
- Émission de message à chaque commande (RabbitMQ Pub/Sub)
- API Gateway via noms de domaine (`Traefik`)
- Déploiement avec `docker-compose` et `docker swarm`

---

## 👥 Auteurs

- **Ton prénom & nom**
- Groupe : 2 à 3 personnes
- EPSIC – Module 321 – Veronica Getaz
