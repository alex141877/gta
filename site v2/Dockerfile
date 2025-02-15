# Utiliser une image Node.js officielle avec la version 16
FROM node:16

# Créer un répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de configuration (package.json et package-lock.json)
COPY package*.json ./

# Installer les dépendances via npm
RUN npm install

# Copier tous les fichiers de ton projet dans le conteneur
COPY . .

# Exposer le port sur lequel l'application tourne (par défaut 3000 pour Express)
EXPOSE 3000

# Démarrer l'application avec la commande "npm start"
CMD ["npm", "start"]
