import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Fonction pour générer toutes les paires possibles pour un nouveau joueur
async function generatePairsForNewPlayer(playerId: number) {
  const otherPlayers = await prisma.player.findMany({
    where: {
      NOT: {
        id: playerId
      }
    }
  })

  for (const otherPlayer of otherPlayers) {
    // Créer la paire dans l'ordre croissant des IDs pour éviter les doublons
    const [player1Id, player2Id] = [playerId, otherPlayer.id].sort((a, b) => a - b)
    
    await prisma.playerPair.create({
      data: {
        player1Id,
        player2Id,
        victories: 0,
        defeats: 0,
        congo: 0,
        passage: 0
      }
    })
  }
}

export async function GET() {
  try {
    const pairs = await prisma.playerPair.findMany({
      include: {
        player1: true,
        player2: true,
      },
    })

    const pairsWithStats = pairs.map(pair => {
      const totalGames = pair.victories + pair.defeats
      const ratio = totalGames > 0 ? pair.victories / totalGames : 0

      return {
        ...pair,
        ratio,
      }
    })

    return NextResponse.json(pairsWithStats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paires' },
      { status: 500 }
    )
  }
}

// Mise à jour des statistiques d'une paire
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { player1Id, player2Id, isVictory, congo, passage } = body

    // Trouver la paire dans l'ordre correct
    const [smallerId, largerId] = [player1Id, player2Id].sort((a, b) => a - b)
    
    const pair = await prisma.playerPair.findUnique({
      where: {
        player1Id_player2Id: {
          player1Id: smallerId,
          player2Id: largerId
        }
      }
    })

    if (!pair) {
      return NextResponse.json(
        { error: 'Paire non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour les statistiques
    const updatedPair = await prisma.playerPair.update({
      where: {
        id: pair.id
      },
      data: {
        victories: isVictory ? pair.victories + 1 : pair.victories,
        defeats: !isVictory ? pair.defeats + 1 : pair.defeats,
        congo: pair.congo + (congo || 0),
        passage: pair.passage + (passage || 0)
      }
    })

    return NextResponse.json(updatedPair)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des statistiques de la paire' },
      { status: 500 }
    )
  }
}

// Création d'une nouvelle paire
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { player1Id, player2Id } = body

    // Vérifier que les IDs sont fournis
    if (!player1Id || !player2Id) {
      return NextResponse.json(
        { error: 'Les IDs des deux joueurs sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que les joueurs existent
    const player1 = await prisma.player.findUnique({
      where: { id: player1Id }
    })

    const player2 = await prisma.player.findUnique({
      where: { id: player2Id }
    })

    if (!player1 || !player2) {
      return NextResponse.json(
        { error: 'Un ou plusieurs joueurs n\'existent pas' },
        { status: 404 }
      )
    }

    // Créer la paire dans l'ordre croissant des IDs
    const [smallerId, largerId] = [player1Id, player2Id].sort((a, b) => a - b)

    // Vérifier si la paire existe déjà
    const existingPair = await prisma.playerPair.findUnique({
      where: {
        player1Id_player2Id: {
          player1Id: smallerId,
          player2Id: largerId
        }
      }
    })

    if (existingPair) {
      return NextResponse.json(
        { error: 'Cette paire existe déjà' },
        { status: 400 }
      )
    }

    // Créer la nouvelle paire
    const newPair = await prisma.playerPair.create({
      data: {
        player1Id: smallerId,
        player2Id: largerId,
        victories: 0,
        defeats: 0,
        congo: 0,
        passage: 0
      },
      include: {
        player1: true,
        player2: true
      }
    })

    return NextResponse.json(newPair)
  } catch (error) {
    console.error('Erreur lors de la création de la paire:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la paire' },
      { status: 500 }
    )
  }
} 