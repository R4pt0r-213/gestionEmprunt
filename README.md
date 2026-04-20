# Registre des emprunts

Application web de gestion des emprunts de matériel.

## Stack

- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL
- **Frontend** : HTML/CSS/JS vanilla servi par Express

## Installation locale

```bash
# 1. Installer les dépendances
npm install

# 2. Créer un fichier .env avec ta connexion PostgreSQL locale
echo "DATABASE_URL=postgresql://user:password@localhost:5432/emprunts" > .env

# 3. Démarrer
npm start
```

## Déploiement sur Render

### Étape 1 — Créer la base PostgreSQL
1. Render Dashboard → **New** → **PostgreSQL**
2. Choisir un nom (ex. `emprunts-db`) → **Create Database**
3. Copier l'**Internal Database URL**

### Étape 2 — Créer le Web Service
1. Render Dashboard → **New** → **Web Service**
2. Connecter ton repo GitHub
3. Renseigner :
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
4. Dans **Environment Variables**, ajouter :
   - `DATABASE_URL` → coller l'Internal Database URL copiée à l'étape 1
5. **Create Web Service**

La table `emprunts` est créée automatiquement au premier démarrage.

## API REST

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/emprunts` | Récupère tous les emprunts |
| POST | `/api/emprunts` | Crée un nouvel emprunt |
| DELETE | `/api/emprunts/:id` | Supprime un emprunt (rendu) |

## Structure

```
emprunts-app/
├── server.js        # Serveur Express + API
├── package.json
└── public/
    └── index.html   # Interface web
```
