'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Player {
  id: number
  pseudo: string
  nickname?: string | null
  avatar: string
  victories: number
  defeats: number
  ratio: number
  points: number
  congo: number
}

interface PlayersContextType {
  players: Player[]
  loading: boolean
  refreshPlayers: () => Promise<void>
  addScore: (data: { playerId: number; isVictory: boolean; congo: number }) => Promise<void>
  addPlayer: (data: { pseudo: string; nickname?: string; avatar?: string }) => Promise<void>
  deletePlayer: (playerId: number) => Promise<void>
  resetScores: () => Promise<void>
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined)

function formatPlayerData(player: any): Player {
  return {
    id: player.id,
    pseudo: player.pseudo || '',
    nickname: player.nickname || null,
    avatar: player.avatar || '/default-avatar.png',
    victories: player.victories || 0,
    defeats: player.defeats || 0,
    ratio: player.ratio || 0,
    points: player.points || 0,
    congo: player.congo || 0,
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

  const addScore = async (data: { playerId: number; isVictory: boolean; congo: number }) => {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du score')
      }

      await refreshPlayers()
    } catch (error) {
      console.error('Erreur:', error)
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