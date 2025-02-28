import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updatePairStats() {
  try {
    // Récupérer tous les scores groupés par joueur
    const scores = await prisma.score.findMany({
      include: {
        player: true
      }
    })

    // Créer un map des scores par paire de joueurs
    const pairStats = new Map()

    // Parcourir tous les scores
    for (let i = 0; i < scores.length; i++) {
      const score1 = scores[i]
      
      // Chercher un autre score avec la même date (même match)
      for (let j = i + 1; j < scores.length; j++) {
        const score2 = scores[j]
        
        // Si les scores ont la même date (même match) et des joueurs différents
        if (score1.createdAt === score2.createdAt && score1.playerId !== score2.playerId) {
          // Trier les IDs des joueurs pour avoir une clé cohérente
          const [player1Id, player2Id] = [score1.playerId, score2.playerId].sort((a, b) => a - b)
          const pairKey = `${player1Id}-${player2Id}`

          // Initialiser les stats de la paire si nécessaire
          if (!pairStats.has(pairKey)) {
            pairStats.set(pairKey, {
              player1Id,
              player2Id,
              victories: 0,
              defeats: 0,
              congo: 0,
              passage: 0
            })
          }

          const stats = pairStats.get(pairKey)
          
          // Mettre à jour les statistiques
          if (score1.isVictory === score2.isVictory) {
            // Si les deux joueurs ont gagné ou perdu ensemble (2v2)
            if (score1.isVictory) {
              stats.victories++
            } else {
              stats.defeats++
            }
          }
          
          // Ajouter les congos et passages
          stats.congo += score1.congo + score2.congo
          stats.passage += score1.passage + score2.passage
        }
      }
    }

    // Mettre à jour les paires dans la base de données
    for (const [_, stats] of pairStats) {
      await prisma.playerPair.update({
        where: {
          player1Id_player2Id: {
            player1Id: stats.player1Id,
            player2Id: stats.player2Id
          }
        },
        data: {
          victories: stats.victories,
          defeats: stats.defeats,
          congo: stats.congo,
          passage: stats.passage
        }
      })
    }

    console.log('Statistiques des paires mises à jour avec succès')
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques des paires:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePairStats() 