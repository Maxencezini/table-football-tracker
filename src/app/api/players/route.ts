import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      include: {
        scores: true,
      },
    })

    const playersWithStats = players.map(player => {
      const victories = player.scores.filter(score => score.isVictory).length
      const totalGames = player.scores.length
      const ratio = totalGames > 0 ? victories / totalGames : 0
      const points = (victories * 3) + (totalGames - victories)
      const congo = player.scores.reduce((total, score) => total + score.congo, 0)
      const passage = player.scores.reduce((total, score) => total + score.passage, 0)

      return {
        ...player,
        victories,
        defeats: totalGames - victories,
        ratio,
        points,
        congo,
        passage,
      }
    })

    return NextResponse.json(playersWithStats)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des joueurs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pseudo, nickname, avatar } = body

    const player = await prisma.player.create({
      data: {
        pseudo,
        nickname,
        avatar: avatar || '/default-avatar.png',
      },
    })

    return NextResponse.json(player)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du joueur' }, { status: 500 })
  }
} 