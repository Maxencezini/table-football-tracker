'use client'

import { Player } from '@/contexts/PlayersContext'

interface PlayerScoreFormProps {
  players: Player[]
  selectedPlayer: string
  isVictory: boolean
  congo: number
  passage: number
  onPlayerChange: (value: string) => void
  onVictoryChange: (value: boolean) => void
  onCongoChange: (value: number) => void
  onPassageChange: (value: number) => void
}

export default function PlayerScoreForm({
  players,
  selectedPlayer,
  isVictory,
  congo,
  passage,
  onPlayerChange,
  onVictoryChange,
  onCongoChange,
  onPassageChange,
}: PlayerScoreFormProps) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Joueur
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700"
          value={selectedPlayer}
          onChange={(e) => onPlayerChange(e.target.value)}
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
              onChange={() => onVictoryChange(true)}
            />
            <span className="ml-2">Victoire</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={!isVictory}
              onChange={() => onVictoryChange(false)}
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
            onClick={() => onCongoChange(congo === 0 ? 1 : 0)}
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
          onChange={(e) => onPassageChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="shadow border rounded w-full py-2 px-3 text-gray-700"
        />
      </div>
    </div>
  )
} 