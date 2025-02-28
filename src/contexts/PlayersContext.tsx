'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Score {
  isVictory: boolean
  congo: number
  passage: number
}

export interface Player {
  id: number
  pseudo: string
  nickname?: string | null
  avatar: string
  victories: number
  defeats: number
  ratio: number
  points: number
  congo: number
  passage: number
  scores?: Score[]
}

interface PlayersContextType {
  players: Player[]
  loading: boolean
  refreshPlayers: () => Promise<void>
  addScore: (data: { playerId: number; isVictory: boolean; congo: number; passage: number }) => Promise<void>
  addPlayer: (data: { pseudo: string; nickname?: string; avatar?: string }) => Promise<void>
  deletePlayer: (playerId: number) => Promise<void>
  resetScores: () => Promise<void>
  updatePlayerStats: (playerId: number, data: { victories: number; defeats: number; congo: number; passage: number }) => Promise<void>
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined)

function formatPlayerData(player: any): Player {
  const victories = player.scores?.filter((score: Score) => score.isVictory).length || 0
  const totalGames = player.scores?.length || 0
  const ratio = totalGames > 0 ? victories / totalGames : 0
  const points = (victories * 3) + (totalGames - victories)
  const congo = player.scores?.reduce((total: number, score: Score) => total + score.congo, 0) || 0
  const passage = player.scores?.reduce((total: number, score: Score) => total + score.passage, 0) || 0

  return {
    id: player.id,
    pseudo: player.pseudo || '',
    nickname: player.nickname || null,
    avatar: player.avatar || '/default-avatar.png',
    victories,
    defeats: totalGames - victories,
    ratio,
    points,
    congo,
    passage,
  }
}

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  const refreshPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      const data = await response.json()
      // Formater les données avant de les stocker
      setPlayers(data.map(formatPlayerData))
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs:', error)
    } finally {
      setLoading(false)
    }
  }

  const addScore = async (data: { playerId: number; isVictory: boolean; congo: number; passage: number }) => {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Réponse de l\'API:', errorData)
        throw new Error(errorData.error || 'Erreur lors de l\'ajout du score')
      }

      const result = await response.json()
      console.log('Score ajouté avec succès:', result)
      await refreshPlayers()
    } catch (error) {
      console.error('Erreur détaillée:', error)
      throw error
    }
  }

  const addPlayer = async (data: { pseudo: string; nickname?: string; avatar?: string }) => {
    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du joueur')
      }

      await refreshPlayers()
    } catch (error) {
      console.error('Erreur:', error)
      throw error
    }
  }

  const deletePlayer = async (playerId: number) => {
    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du joueur')
      }

      await refreshPlayers()
    } catch (error) {
      console.error('Erreur:', error)
      throw error
    }
  }

  const resetScores = async () => {
    try {
      const response = await fetch('/api/scores/reset', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la réinitialisation des scores')
      }

      await refreshPlayers()
    } catch (error) {
      console.error('Erreur:', error)
      throw error
    }
  }

  const updatePlayerStats = async (playerId: number, data: { victories: number; defeats: number; congo: number; passage: number }) => {
    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Erreur lors de la mise à jour des statistiques')
      }

      const result = await response.json()
      console.log('Mise à jour réussie:', result)
      await refreshPlayers()
    } catch (error) {
      console.error('Erreur détaillée:', error)
      throw error
    }
  }

  useEffect(() => {
    refreshPlayers()
  }, [])

  return (
    <PlayersContext.Provider
      value={{
        players,
        loading,
        refreshPlayers,
        addScore,
        addPlayer,
        deletePlayer,
        resetScores,
        updatePlayerStats,
      }}
    >
      {children}
    </PlayersContext.Provider>
  )
}

export function usePlayers() {
  const context = useContext(PlayersContext)
  if (context === undefined) {
    throw new Error('usePlayers must be used within a PlayersProvider')
  }
  return context
} 