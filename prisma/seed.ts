import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Nettoyer la base de données
  await prisma.score.deleteMany()
  await prisma.playerPair.deleteMany()
  await prisma.player.deleteMany()

  // Créer les joueurs
  const players = await Promise.all([
    prisma.player.create({
      data: {
        pseudo: 'Player1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player1',
      },
    }),
    prisma.player.create({
      data: {
        pseudo: 'Player2',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player2',
      },
    }),
    prisma.player.create({
      data: {
        pseudo: 'Player3',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player3',
      },
    }),
    prisma.player.create({
      data: {
        pseudo: 'Player4',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player4',
      },
    }),
  ])

  // Créer quelques scores
  const scores = await Promise.all([
    // Scores pour Player1
    prisma.score.create({
      data: {
        playerId: players[0].id,
        isVictory: true,
        congo: 1,
        passage: 2,
      },
    }),
    // Scores pour Player2
    prisma.score.create({
      data: {
        playerId: players[1].id,
        isVictory: false,
        congo: 0,
        passage: 1,
      },
    }),
  ])

  // Créer les paires de joueurs
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      await prisma.playerPair.create({
        data: {
          player1Id: players[i].id,
          player2Id: players[j].id,
          victories: Math.floor(Math.random() * 5),
          defeats: Math.floor(Math.random() * 5),
          congo: Math.floor(Math.random() * 3),
          passage: Math.floor(Math.random() * 5),
        },
      })
    }
  }

  console.log('Base de données initialisée avec succès')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 