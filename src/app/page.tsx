'use client';

import { RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Pagination from '@/components/Pagination';
import { usePlayers } from '@/contexts/PlayersContext';

export default function Home() {
  const { players, loading, resetScores } = usePlayers();
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const itemsPerPage = 10;

  const handleResetScores = async () => {
    try {
      await resetScores();
      setShowConfirmReset(false);
    } catch (error) {
      alert('Erreur lors de la réinitialisation des scores');
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  const totalPages = Math.ceil(players.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = players.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau des joueurs</h1>
        <button
          onClick={() => setShowConfirmReset(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Réinitialiser les scores
        </button>
      </div>

      {showConfirmReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmer la réinitialisation</h2>
            <p className="mb-6 text-gray-600">
              Êtes-vous sûr de vouloir réinitialiser tous les scores ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleResetScores}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joueur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Victoires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Défaites</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ratio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Congo</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPlayers.map((player) => {
              const victories = player.victories || 0;
              const defeats = player.defeats || 0;
              const ratio = player.ratio || 0;
              const points = player.points || 0;
              const congo = player.congo || 0;

              return (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={player.avatar || '/default-avatar.png'}
                          alt={player.pseudo || 'Avatar'}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{player.pseudo}</div>
                        {player.nickname && (
                          <div className="text-sm text-gray-500">{player.nickname}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {victories}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {defeats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(ratio * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(congo)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
