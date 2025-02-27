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
  const [passage, setPassage] = useState(0)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedPlayer) {
      setError('Veuillez sélectionner un joueur')
      return
    }

    try {
      const scoreData = {
        playerId: parseInt(selectedPlayer),
        isVictory,
        congo: Number(congo),
        passage: Number(passage),
      }
      console.log('Envoi des données:', scoreData)
      await addScore(scoreData)
      onClose()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du score:', error)
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'ajout du score')
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
              Congo
            </label>
            <div className="flex items-center">
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  congo ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                onClick={() => setCongo(congo === 0 ? 1 : 0)}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    congo ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm text-gray-500">{congo ? 'Oui' : 'Non'}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Passage
            </label>
            <input
              type="number"
              min="0"
              value={passage}
              onChange={(e) => setPassage(Math.max(0, parseInt(e.target.value) || 0))}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
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