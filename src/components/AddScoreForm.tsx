'use client'

import { useState } from 'react'
import { usePlayers } from '@/contexts/PlayersContext'

interface Player {
  id: number
  pseudo: string
  nickname?: string | null
  avatar: string
}

interface AddScoreFormProps {
  onClose: () => void
}

export default function AddScoreForm({ onClose }: AddScoreFormProps) {
  const { players, addScore } = usePlayers()
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [isVictory, setIsVictory] = useState(true)
  const [congo, setCongo] = useState(0)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedPlayer) {
      setError('Veuillez sélectionner un joueur')
      return
    }

    try {
      await addScore({
        playerId: parseInt(selectedPlayer),
        isVictory,
        congo,
      })
      onClose()
    } catch (error) {
      setError('Une erreur est survenue lors de l\'ajout du score')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Ajouter un score</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Joueur
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option value="">Sélectionner un joueur</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.pseudo}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Résultat
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={isVictory}
                  onChange={() => setIsVictory(true)}
                />
                <span className="ml-2">Victoire</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={!isVictory}
                  onChange={() => setIsVictory(false)}
                />
                <span className="ml-2">Défaite</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Congo (0 ou 1)
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={congo}
              onChange={(e) => setCongo(parseInt(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 