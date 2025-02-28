# Table Football Tracker

Une application web moderne pour suivre les statistiques des joueurs de baby-foot, développée avec Next.js 14, Prisma et SQLite.

## 🌟 Fonctionnalités

- 👥 Gestion des joueurs (ajout, suppression, modification)
- 📊 Suivi des statistiques individuelles (victoires, défaites, ratio)
- 🤝 Gestion des paires de joueurs et leurs statistiques
- 🏆 Classements et podiums
- 🎯 Suivi des "congo" et "passage"
- 🔄 Mode plein écran pour les écrans d'affichage
- 🎨 Interface utilisateur moderne et responsive

## 🛠 Technologies

- **Frontend**: Next.js 14, TailwindCSS, TypeScript
- **Backend**: Next.js API Routes
- **Base de données**: SQLite avec Prisma ORM
- **Conteneurisation**: Docker & Docker Compose

## 🚀 Installation

### Développement local

```bash
# Cloner le repository
git clone https://github.com/votre-username/table-football-tracker.git
cd table-football-tracker

# Installer les dépendances
npm install

# Configurer la base de données
npx prisma migrate dev

# Lancer le serveur de développement
npm run dev
```

### Avec Docker

```bash
# Construire et lancer l'application
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

## 📝 Structure du projet

```
table-football-tracker/
├── src/
│   ├── app/              # Routes et pages Next.js
│   ├── components/       # Composants React réutilisables
│   ├── contexts/        # Contextes React (PlayersContext, etc.)
│   └── lib/             # Utilitaires et configurations
├── prisma/
│   ├── schema.prisma    # Schéma de la base de données
│   └── migrations/      # Migrations de la base de données
├── public/             # Fichiers statiques
└── scripts/           # Scripts utilitaires
```

## 🔧 Configuration

L'application utilise plusieurs variables d'environnement que vous pouvez configurer :

```env
# Exemple de .env
DATABASE_URL="file:./dev.db"
NEXT_TELEMETRY_DISABLED=1
```

## 🎮 Utilisation

1. **Gestion des joueurs**
   - Ajoutez des joueurs avec leur pseudo et avatar
   - Modifiez leurs informations
   - Supprimez des joueurs si nécessaire

2. **Enregistrement des scores**
   - Choisissez le type de match (1v1 ou 2v2)
   - Sélectionnez les joueurs
   - Indiquez le résultat, les congo et passages

3. **Visualisation des statistiques**
   - Consultez le classement général
   - Visualisez les statistiques par paires
   - Suivez l'évolution des performances

## 🔒 Sécurité

- Protection contre la réinitialisation accidentelle des scores
- Utilisateur non-root dans Docker
- Limitation des ressources conteneur

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🐛 Résolution des problèmes courants

### La base de données ne se met pas à jour

```bash
# Réinitialiser la base de données
npx prisma migrate reset

# Regénérer le client Prisma
npx prisma generate
```

### Les paires ne s'affichent pas

```bash
# Générer les paires manquantes via l'API
curl -X POST http://localhost:3000/api/pairs/generate
```

## 📱 Captures d'écran

[À venir]
