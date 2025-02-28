'use client';

import { RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Pagination from '@/components/Pagination';
import { usePlayers } from '@/contexts/PlayersContext';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'points' | 'victories' | 'defeats' | 'congo' | 'passage' | 'ratio';
type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  field: SortField | null;
  direction: SortDirection;
}

export default function Home() {
  const { players, loading, resetScores } = usePlayers();
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    field: 'points',
    direction: 'desc',
  });
  const itemsPerPage = 10;

  const handleResetScores = async () => {
    if (password !== 'DELETE') {
      setPasswordError('Mot de passe incorrect');
      return;
    }
    try {
      await resetScores();
      setShowConfirmReset(false);
      setPassword('');
      setPasswordError('');
    } catch (error) {
      alert('Erreur lors de la réinitialisation des scores');
    }
  };

  const handleSort = (field: SortField) => {
    setSortState(prevState => ({
      field,
      direction: 
        prevState.field === field
          ? prevState.direction === 'asc'
            ? 'desc'
            : prevState.direction === 'desc'
              ? null
              : 'asc'
          : 'asc',
    }));
  };

  const getSortedPlayers = () => {
    if (!sortState.field || !sortState.direction) {
      return players;
    }

    return [...players].sort((a, b) => {
      const aValue = a[sortState.field!];
      const bValue = b[sortState.field!];
      
      if (sortState.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortState.field !== field) {
      return (
        <div className="inline-flex flex-col ml-1 text-gray-400">
          <ChevronUp className="h-3 w-3" />
          <ChevronDown className="h-3 w-3 -mt-1" />
        </div>
      );
    }
    return sortState.direction === 'asc' ? (
      <ChevronUp className="inline h-4 w-4 ml-1 text-blue-500" />
    ) : (
      <ChevronDown className="inline h-4 w-4 ml-1 text-blue-500" />
    );
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  const sortedPlayers = getSortedPlayers();
  const totalPages = Math.ceil(sortedPlayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = sortedPlayers.slice(startIndex, endIndex);

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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmer la réinitialisation</h2>
            <p className="mb-6 text-gray-600">
              Êtes-vous sûr de vouloir réinitialiser tous les scores ? Cette action est irréversible.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Entrez le mot de passe"
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowConfirmReset(false);
                    setPassword('');
                    setPasswordError('');
                  }}
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
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joueur</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('points')}
              >
                Points
                <SortIcon field="points" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('victories')}
              >
                Victoires
                <SortIcon field="victories" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('defeats')}
              >
                Défaites
                <SortIcon field="defeats" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('congo')}
              >
                Congo
                <SortIcon field="congo" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('passage')}
              >
                Passage
                <SortIcon field="passage" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('ratio')}
              >
                Ratio
                <SortIcon field="ratio" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPlayers.map((player) => {
              const victories = player.victories || 0;
              const defeats = player.defeats || 0;
              const ratio = player.ratio || 0;
              const points = player.points || 0;
              const congo = player.congo || 0;
              const passage = player.passage || 0;

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
                    {points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {victories}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {defeats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(congo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {passage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(ratio * 100).toFixed(1)}%
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
