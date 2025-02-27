import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Supprimer tous les scores
    await prisma.score.deleteMany({})

    return NextResponse.json({ message: 'Scores réinitialisés avec succès' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation des scores' },
      { status: 500 }
    )
  }
} 