# Étape de construction
FROM node:20-alpine AS builder

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances
RUN npm ci

# Copie du reste des fichiers du projet
COPY . .

# Génération du client Prisma et build de l'application
RUN npx prisma generate
RUN npm run build

# Étape de production
FROM node:20-alpine AS runner

WORKDIR /app

# Définition des variables d'environnement
ENV NODE_ENV production

# Installation des dépendances nécessaires pour SQLite
RUN apk add --no-cache sqlite

# Copie des fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/assets ./src/assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Création des répertoires nécessaires et attribution des permissions
RUN mkdir -p /app/prisma /app/public/assets/img && \
    chown -R node:node /app

# Utilisation d'un utilisateur non-root
USER node

# Exposition du port
EXPOSE 3000

# Commande de démarrage avec migration automatique de la base de données
CMD npx prisma migrate deploy && node server.js 