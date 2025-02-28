import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Récupérer tous les joueurs
    const players = await prisma.player.findMany()

    // Générer toutes les combinaisons possibles de paires
    const pairs = []
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        pairs.push({
          player1Id: players[i].id,
          player2Id: players[j].id,
        })
      }
    }

    // Créer les paires qui n'existent pas encore
    const createdPairs = []
    for (const pair of pairs) {
      const existingPair = await prisma.playerPair.findUnique({
        where: {
          player1Id_player2Id: {
            player1Id: pair.player1Id,
            player2Id: pair.player2Id
          }
        }
      })

      if (!existingPair) {
        const newPair = await prisma.playerPair.create({
          data: {
            player1Id: pair.player1Id,
            player2Id: pair.player2Id,
            victories: 0,
            defeats: 0,
            congo: 0,
            passage: 0
          }
        })
        createdPairs.push(newPair)
      }
    }

    return NextResponse.json({
      message: `${createdPairs.length} nouvelles paires créées avec succès`,
      createdPairs
    })
  } catch (error) {
    console.error('Erreur lors de la génération des paires:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération des paires' },
      { status: 500 }
    )
  }
} 