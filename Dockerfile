# Étape de construction
FROM node:20-alpine AS builder

# Définition du répertoire de travail
WORKDIR /app

# Installation des dépendances système nécessaires
RUN apk add --no-cache libc6-compat

# Copie des fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY next.config.js ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Installation des dépendances avec un cache optimisé
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
ENV NEXT_TELEMETRY_DISABLED 1

# Installation des dépendances nécessaires pour SQLite et autres utilitaires
RUN apk add --no-cache sqlite curl

# Création d'un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

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
    chown -R nextjs:nodejs /app

# Utilisation de l'utilisateur non-root
USER nextjs

# Exposition du port
EXPOSE 3000

# Vérification de la santé de l'application
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Commande de démarrage avec migration automatique de la base de données
CMD npx prisma migrate deploy && node server.js 