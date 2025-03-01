import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Supprimer d'abord les paires associées au joueur
    await prisma.playerPair.deleteMany({
      where: {
        OR: [
          { player1Id: id },
          { player2Id: id }
        ]
      }
    })

    // Supprimer ensuite tous les scores associés au joueur
    await prisma.score.deleteMany({
      where: { playerId: id },
    })

    // Enfin, supprimer le joueur
    await prisma.player.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Joueur supprimé avec succès' })
  } catch (error) {
    console.error('Erreur détaillée lors de la suppression:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la suppression du joueur',
        details: error instanceof Error ? error.message : String(error)
      },
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
    const { nickname, pseudo, avatar } = body

    // Validation des valeurs
    if (victories < 0 || defeats < 0 || congo < 0 || passage < 0) {
      return NextResponse.json(
        { error: 'Les valeurs ne peuvent pas être négatives' },
        { status: 400 }
      )
    }

    // Vérifier que le joueur existe
    const player = await prisma.player.findUnique({
      where: { id },
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Joueur non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour les informations du joueur
    const updateData: any = {}
    if (nickname !== undefined) updateData.nickname = nickname
    if (pseudo !== undefined) updateData.pseudo = pseudo
    if (avatar !== undefined) updateData.avatar = avatar

    if (Object.keys(updateData).length > 0) {
      await prisma.player.update({
        where: { id },
        data: updateData
      })
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
        createdAt: new Date(),
      })
    } else {
      // Ajouter les victoires
      for (let i = 0; i < victories; i++) {
        scores.push({
          playerId: id,
          isVictory: true,
          congo: 0,
          passage: 0,
          createdAt: new Date(),
        })
      }

      // Ajouter les défaites
      for (let i = 0; i < defeats; i++) {
        scores.push({
          playerId: id,
          isVictory: false,
          congo: 0,
          passage: 0,
          createdAt: new Date(),
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
        passage,
        nickname,
        pseudo,
        avatar
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