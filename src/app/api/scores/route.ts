import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { playerId, isVictory, congo } = body

    // Validation de la valeur de congo
    if (typeof congo !== 'number' || congo < 0 || congo > 1) {
      return NextResponse.json(
        { error: 'La valeur de congo doit être un nombre entre 0 et 1' },
        { status: 400 }
      )
    }

    const score = await prisma.score.create({
      data: {
        playerId,
        isVictory,
        congo,
        date: new Date(),
      },
    })

    return NextResponse.json(score)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajout du score' }, { status: 500 })
  }
} 