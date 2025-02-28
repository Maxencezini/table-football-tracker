import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Réinitialiser toutes les statistiques des paires
    await prisma.playerPair.updateMany({
      data: {
        victories: 0,
        defeats: 0,
        congo: 0,
        passage: 0,
      },
    })

    return NextResponse.json({ message: 'Statistiques des paires réinitialisées avec succès' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation des statistiques des paires' },
      { status: 500 }
    )
  }
} 