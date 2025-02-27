# Table Football Tracker

Une application web moderne pour suivre les performances des joueurs de baby-foot, développée avec Next.js, Prisma et TypeScript.

## 🌟 Fonctionnalités

- 📊 Tableau de bord avec statistiques des joueurs
- 👥 Gestion des joueurs (ajout, modification, suppression)
- 🏆 Système de classement
- ✍️ Enregistrement des scores avec système de "congo"
- 📱 Interface responsive et moderne
- 🔄 Réinitialisation des scores

## 🚀 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/Maxencezini/table-football-tracker.git
cd table-football-tracker
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez la base de données :
```bash
npx prisma generate
npx prisma db push
```

4. Lancez l'application en mode développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## 💻 Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [Prisma](https://www.prisma.io/) - ORM pour la base de données
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [SQLite](https://www.sqlite.org/) - Base de données

## 📝 Structure du projet

```
src/
├── app/                    # Pages et routes de l'application
├── components/            # Composants réutilisables
├── contexts/             # Contextes React (gestion d'état)
├── lib/                  # Utilitaires et configurations
└── assets/              # Ressources statiques
```

## 🛠️ Fonctionnalités principales

### Gestion des joueurs
- Ajout de nouveaux joueurs avec pseudo, surnom et avatar
- Modification des informations des joueurs
- Suppression de joueurs

### Système de score
- Enregistrement des victoires/défaites
- Système de "congo" (0 ou 1)
- Calcul automatique des ratios et points

### Classement
- Classement dynamique basé sur les points
- Mise en évidence des trois premiers
- Statistiques détaillées par joueur

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
