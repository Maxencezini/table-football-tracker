import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Supprimer d'abord tous les scores associés au joueur
    await prisma.score.deleteMany({
      where: { playerId: id },
    })

    // Puis supprimer le joueur
    await prisma.player.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Joueur supprimé avec succès' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du joueur' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de joueur invalide' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const victories = parseInt(body.victories) || 0
    const defeats = parseInt(body.defeats) || 0
    const congo = parseFloat(body.congo) || 0
    const passage = parseInt(body.passage) || 0

    // Validation des valeurs
    if (victories < 0 || defeats < 0 || congo < 0 || passage < 0) {
      return NextResponse.json(
        { error: 'Les valeurs ne peuvent pas être négatives' },
        { status: 400 }
      )
    }

    // Supprimer tous les scores existants
    await prisma.score.deleteMany({
      where: { playerId: id },
    })

    // Créer les nouveaux scores
    const scores = []

    // Si on a des points de congo ou passage mais pas de scores, créer un score par défaut
    if ((congo > 0 || passage > 0) && victories === 0 && defeats === 0) {
      scores.push({
        playerId: id,
        isVictory: false,
        congo,
        passage,
        date: new Date(),
      })
    } else {
      // Ajouter les victoires
      for (let i = 0; i < victories; i++) {
        scores.push({
          playerId: id,
          isVictory: true,
          congo: 0,
          passage: 0,
          date: new Date(),
        })
      }

      // Ajouter les défaites
      for (let i = 0; i < defeats; i++) {
        scores.push({
          playerId: id,
          isVictory: false,
          congo: 0,
          passage: 0,
          date: new Date(),
        })
      }

      // Ajouter les scores avec congo et passage au premier score s'il existe
      if (scores.length > 0) {
        if (congo > 0) {
          scores[0].congo = congo
        }
        if (passage > 0) {
          scores[0].passage = passage
        }
      }
    }

    // Vérifier que le joueur existe avant de créer les scores
    const player = await prisma.player.findUnique({
      where: { id },
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Joueur non trouvé' },
        { status: 404 }
      )
    }

    // Créer tous les scores en une seule opération
    if (scores.length > 0) {
      await prisma.score.createMany({
        data: scores,
      })
    }

    return NextResponse.json({ 
      message: 'Statistiques mises à jour avec succès',
      updatedStats: {
        victories,
        defeats,
        congo,
        passage
      }
    })
  } catch (error) {
    console.error('Erreur détaillée:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la mise à jour des statistiques',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 