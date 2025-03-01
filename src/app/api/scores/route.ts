import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Données reçues:', body)
    
    const { playerId, isVictory, congo, passage } = body

    // Validation des données requises
    if (!playerId) {
      console.error('ID du joueur manquant')
      return NextResponse.json(
        { error: 'L\'ID du joueur est requis' },
        { status: 400 }
      )
    }

    if (typeof isVictory !== 'boolean') {
      console.error('Statut de victoire invalide:', isVictory)
      return NextResponse.json(
        { error: 'Le statut de victoire doit être un booléen' },
        { status: 400 }
      )
    }

    // Validation de la valeur de congo
    if (typeof congo !== 'number' || congo < 0 || congo > 1) {
      console.error('Valeur de congo invalide:', congo)
      return NextResponse.json(
        { error: 'La valeur de congo doit être un nombre entre 0 et 1' },
        { status: 400 }
      )
    }

    // Validation de la valeur de passage
    if (typeof passage !== 'number' || passage < 0) {
      console.error('Valeur de passage invalide:', passage)
      return NextResponse.json(
        { error: 'La valeur de passage doit être un nombre supérieur ou égal à 0' },
        { status: 400 }
      )
    }

    // Vérifier que le joueur existe
    const player = await prisma.player.findUnique({
      where: { id: playerId },
    })

    if (!player) {
      console.error('Joueur non trouvé:', playerId)
      return NextResponse.json(
        { error: 'Joueur non trouvé' },
        { status: 404 }
      )
    }

    try {
      const score = await prisma.score.create({
        data: {
          playerId,
          isVictory,
          congo,
          passage,
        }
      })

      console.log('Score créé avec succès:', score)
      return NextResponse.json({ 
        message: 'Score ajouté avec succès',
        score 
      })
    } catch (dbError) {
      console.error('Erreur Prisma détaillée:', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de la création du score dans la base de données' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du score:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'ajout du score',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 