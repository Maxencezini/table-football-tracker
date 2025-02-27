'use client';

import { usePlayers } from '@/contexts/PlayersContext';
import Image from 'next/image';

export default function RankingPage() {
  const { players } = usePlayers();

  // Trier les joueurs par points (décroissant)
  const sortedPlayers = [...players].sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Classement</h1>
          <p className="mt-2 text-sm text-gray-700">
            Classement des joueurs basé sur leurs performances.
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Position</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joueur</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Points</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Victoires</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Défaites</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ratio</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Congo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedPlayers.map((player, index) => (
                  <tr key={player.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={player.avatar || '/default-avatar.png'}
                            alt={player.pseudo}
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {player.points || 0}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {player.victories || 0}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {player.defeats || 0}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {((player.ratio || 0) * 100).toFixed(1)}%
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {Math.floor(player.congo || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 