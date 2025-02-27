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