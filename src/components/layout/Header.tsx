'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddScoreForm from '@/components/AddScoreForm';
import { usePlayers } from '@/contexts/PlayersContext';

export default function Header() {
  const { players, addScore, addPlayer } = usePlayers();
  const [isAddingScore, setIsAddingScore] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ pseudo: '', nickname: '', avatar: '' });

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPlayer(newPlayer);
      setNewPlayer({ pseudo: '', nickname: '', avatar: '' });
      setIsAddingPlayer(false);
    } catch (error) {
      alert('Erreur lors de l\'ajout du joueur');
    }
  };

  const handleAddScore = async (data: { playerId: number; isVictory: boolean; congo: number; passage: number }) => {
    try {
      await addScore(data);
      setIsAddingScore(false);
    } catch (error) {
      alert('Erreur lors de l\'ajout du score');
    }
  };

  return (
    <>
      <div className="flex h-16 items-center border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 font-[var(--font-roboto)] uppercase">Baby-foot Molecule</h1>
          <div className="flex gap-x-4">
            <button
              type="button"
              onClick={() => setIsAddingScore(true)}
              className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Ajouter un score
            </button>
            <button
              type="button"
              onClick={() => setIsAddingPlayer(true)}
              className="inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Ajouter un joueur
            </button>
          </div>
        </div>
      </div>

      {/* Formulaires */}
      {isAddingScore && (
        <AddScoreForm
          onClose={() => setIsAddingScore(false)}
        />
      )}

      {isAddingPlayer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Nouveau Joueur</h2>
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div>
                <label htmlFor="pseudo" className="block text-sm font-medium text-gray-700">
                  Pseudo
                </label>
                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  value={newPlayer.pseudo}
                  onChange={(e) => setNewPlayer({ ...newPlayer, pseudo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  URL de l'avatar (optionnel)
                </label>
                <input
                  type="url"
                  name="avatar"
                  id="avatar"
                  value={newPlayer.avatar}
                  onChange={(e) => setNewPlayer({ ...newPlayer, avatar: e.target.value })}
                  placeholder="Merci de renseigner l'url de votre avatar slack"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddingPlayer(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 