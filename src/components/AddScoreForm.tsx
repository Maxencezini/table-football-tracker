'use client'

import { useState } from 'react'
import { usePlayers } from '@/contexts/PlayersContext'
import Image from 'next/image'
import MatchTypeSelector from './MatchTypeSelector'
import PlayerScoreForm from './PlayerScoreForm'

interface PlayerFormState {
  selectedPlayer: string
  isVictory: boolean
  congo: number
  passage: number
}

type MatchType = '1v1' | '2v2' | null

export default function AddScoreForm({ onClose }: { onClose: () => void }) {
  const { players, addScore } = usePlayers()
  const [matchType, setMatchType] = useState<MatchType>(null)
  const [error, setError] = useState('')

  // État pour l'équipe 1 (gauche)
  const [team1Players, setTeam1Players] = useState<PlayerFormState[]>([
    { selectedPlayer: '', isVictory: true, congo: 0, passage: 0 },
  ])

  // État pour l'équipe 2 (droite)
  const [team2Players, setTeam2Players] = useState<PlayerFormState[]>([
    { selectedPlayer: '', isVictory: false, congo: 0, passage: 0 },
  ])

  const handleMatchTypeSelect = (type: '1v1' | '2v2') => {
    setMatchType(type)
    if (type === '2v2') {
      setTeam1Players([
        { selectedPlayer: '', isVictory: true, congo: 0, passage: 0 },
        { selectedPlayer: '', isVictory: true, congo: 0, passage: 0 },
      ])
      setTeam2Players([
        { selectedPlayer: '', isVictory: false, congo: 0, passage: 0 },
        { selectedPlayer: '', isVictory: false, congo: 0, passage: 0 },
      ])
    }
  }

  const updateTeam1Player = (index: number, updates: Partial<PlayerFormState>) => {
    const newTeam1Players = [...team1Players]
    newTeam1Players[index] = { ...newTeam1Players[index], ...updates }
    setTeam1Players(newTeam1Players)

    // Mettre à jour la victoire pour tous les joueurs de l'équipe
    if ('isVictory' in updates) {
      setTeam1Players(team1Players.map(player => ({
        ...player,
        isVictory: updates.isVictory!
      })))
      setTeam2Players(team2Players.map(player => ({
        ...player,
        isVictory: !updates.isVictory!
      })))
    }
  }

  const updateTeam2Player = (index: number, updates: Partial<PlayerFormState>) => {
    const newTeam2Players = [...team2Players]
    newTeam2Players[index] = { ...newTeam2Players[index], ...updates }
    setTeam2Players(newTeam2Players)

    // Mettre à jour la victoire pour tous les joueurs de l'équipe
    if ('isVictory' in updates) {
      setTeam2Players(team2Players.map(player => ({
        ...player,
        isVictory: updates.isVictory!
      })))
      setTeam1Players(team1Players.map(player => ({
        ...player,
        isVictory: !updates.isVictory!
      })))
    }
  }

  const updatePairStats = async (player1Id: number, player2Id: number, isVictory: boolean, congo: number, passage: number) => {
    try {
      await fetch('/api/pairs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1Id,
          player2Id,
          isVictory,
          congo,
          passage,
        }),
      })
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques de la paire:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation des données
      if (matchType === null) {
        alert('Veuillez sélectionner un type de match')
        return
      }

      const team1Valid = team1Players.every(player => player.selectedPlayer !== '')
      const team2Valid = team2Players.every(player => player.selectedPlayer !== '')

      if (!team1Valid || !team2Valid) {
        alert('Veuillez sélectionner tous les joueurs')
        return
      }

      console.log('Soumission du formulaire avec les données:', {
        matchType,
        team1Players,
        team2Players
      })

      // Création des scores pour l'équipe 1
      const team1Promises = team1Players.map(player => {
        if (!player.selectedPlayer) return null
        return addScore({
          playerId: parseInt(player.selectedPlayer),
          isVictory: player.isVictory,
          congo: player.congo,
          passage: player.passage,
        })
      })

      // Création des scores pour l'équipe 2
      const team2Promises = team2Players.map(player => {
        if (!player.selectedPlayer) return null
        return addScore({
          playerId: parseInt(player.selectedPlayer),
          isVictory: !team1Players[0].isVictory, // Inverse du résultat de l'équipe 1
          congo: player.congo,
          passage: player.passage,
        })
      })

      // Attendre que tous les scores soient créés
      await Promise.all([...team1Promises, ...team2Promises].filter(Boolean))

      // Mise à jour des statistiques des paires si c'est un match 2v2
      if (matchType === '2v2') {
        const team1Ids = team1Players.map(p => parseInt(p.selectedPlayer))
        const team2Ids = team2Players.map(p => parseInt(p.selectedPlayer))
        
        await updatePairStats(
          team1Ids[0],
          team1Ids[1],
          team1Players[0].isVictory,
          Math.max(team1Players[0].congo, team1Players[1].congo),
          team1Players[0].passage + team1Players[1].passage
        )
        
        await updatePairStats(
          team2Ids[0],
          team2Ids[1],
          !team1Players[0].isVictory,
          Math.max(team2Players[0].congo, team2Players[1].congo),
          team2Players[0].passage + team2Players[1].passage
        )
      }

      onClose()
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error)
      alert(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'ajout des scores')
    }
  }

  if (!matchType) {
    return <MatchTypeSelector onSelect={handleMatchTypeSelect} onClose={onClose} />
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl mx-4 relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          {matchType === '1v1' ? 'Match 1 contre 1' : 'Match 2 contre 2'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-8">
          {/* Équipe 1 (Gauche) */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-center">Équipe 1</h3>
            <div className="space-y-6">
              {team1Players.map((player, index) => (
                <PlayerScoreForm
                  key={index}
                  players={players}
                  selectedPlayer={player.selectedPlayer}
                  isVictory={player.isVictory}
                  congo={player.congo}
                  passage={player.passage}
                  onPlayerChange={(value) => updateTeam1Player(index, { selectedPlayer: value })}
                  onVictoryChange={(value) => updateTeam1Player(index, { isVictory: value })}
                  onCongoChange={(value) => updateTeam1Player(index, { congo: value })}
                  onPassageChange={(value) => updateTeam1Player(index, { passage: value })}
                />
              ))}
            </div>
          </div>

          {/* Image VS au centre */}
          <div className="flex items-center justify-center">
            <Image
              src="/assets/img/vs.gif"
              alt="VS"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Équipe 2 (Droite) */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-center">Équipe 2</h3>
            <div className="space-y-6">
              {team2Players.map((player, index) => (
                <PlayerScoreForm
                  key={index}
                  players={players}
                  selectedPlayer={player.selectedPlayer}
                  isVictory={player.isVictory}
                  congo={player.congo}
                  passage={player.passage}
                  onPlayerChange={(value) => updateTeam2Player(index, { selectedPlayer: value })}
                  onVictoryChange={(value) => updateTeam2Player(index, { isVictory: value })}
                  onCongoChange={(value) => updateTeam2Player(index, { congo: value })}
                  onPassageChange={(value) => updateTeam2Player(index, { passage: value })}
                />
              ))}
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
} 