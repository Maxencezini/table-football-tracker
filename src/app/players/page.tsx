'use client';

import { useState } from 'react';
import { usePlayers } from '@/contexts/PlayersContext';
import Image from 'next/image';
import { Pencil, Check, X, Trash2 } from 'lucide-react';

interface EditableCell {
  playerId: number;
  field: string;
  value: string;
}

export default function PlayersPage() {
  const { players, deletePlayer, updatePlayerStats } = usePlayers();
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deletingPlayer, setDeletingPlayer] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (playerId: number, field: string, value: string | number) => {
    setError(null);
    setEditingCell({ playerId, field, value: value.toString() });
    setEditValue(value.toString());
  };

  const handleSave = async () => {
    if (!editingCell) return;
    setError(null);

    try {
      const player = players.find(p => p.id === editingCell.playerId);
      if (!player) return;

      if (['victories', 'defeats', 'congo', 'passage'].includes(editingCell.field)) {
        const value = parseInt(editValue);
        if (isNaN(value) || value < 0) {
          setError('La valeur doit être un nombre positif');
          return;
        }

        await updatePlayerStats(editingCell.playerId, {
          victories: editingCell.field === 'victories' ? value : player.victories,
          defeats: editingCell.field === 'defeats' ? value : player.defeats,
          congo: editingCell.field === 'congo' ? value : player.congo,
          passage: editingCell.field === 'passage' ? value : player.passage,
        });

        setEditingCell(null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDelete = async (playerId: number) => {
    try {
      await deletePlayer(playerId);
      setDeletingPlayer(null);
    } catch (error) {
      alert('Erreur lors de la suppression du joueur');
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Gestion des Joueurs</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez les informations des joueurs en cliquant sur les cellules pour les modifier.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-400 rounded text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Avatar</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pseudo</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Surnom</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Points</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Victoires</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Défaites</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Congo</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Passage</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ratio</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="whitespace-nowrap px-3 py-4">
                      {editingCell?.playerId === player.id && editingCell.field === 'avatar' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="url"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={() => setEditingCell(null)} className="text-red-600 hover:text-red-700">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={player.avatar || '/default-avatar.png'}
                            alt={player.pseudo}
                            width={40}
                            height={40}
                          />
                          <button
                            onClick={() => handleEdit(player.id, 'avatar', player.avatar || '')}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      {editingCell?.playerId === player.id && editingCell.field === 'pseudo' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={() => setEditingCell(null)} className="text-red-600 hover:text-red-700">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{player.pseudo}</span>
                          <button
                            onClick={() => handleEdit(player.id, 'pseudo', player.pseudo)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      {editingCell?.playerId === player.id && editingCell.field === 'nickname' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={() => setEditingCell(null)} className="text-red-600 hover:text-red-700">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{player.nickname || '-'}</span>
                          <button
                            onClick={() => handleEdit(player.id, 'nickname', player.nickname || '')}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{player.points}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingCell?.playerId === player.id && editingCell.field === 'victories' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={() => setEditingCell(null)} className="text-red-600 hover:text-red-700">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{player.victories}</span>
                          <button
                            onClick={() => handleEdit(player.id, 'victories', player.victories)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingCell?.playerId === player.id && editingCell.field === 'defeats' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={() => setEditingCell(null)} className="text-red-600 hover:text-red-700">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{player.defeats}</span>
                          <button
                            onClick={() => handleEdit(player.id, 'defeats', player.defeats)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingCell?.playerId === player.id && editingCell.field === 'congo' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={() => setEditingCell(null)} className="text-red-600 hover:text-red-700">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{Math.floor(player.congo)}</span>
                          <button
                            onClick={() => handleEdit(player.id, 'congo', Math.floor(player.congo))}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingCell?.playerId === player.id && editingCell.field === 'passage' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={() => setEditingCell(null)} className="text-red-600 hover:text-red-700">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{player.passage}</span>
                          <button
                            onClick={() => handleEdit(player.id, 'passage', player.passage)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{(player.ratio * 100).toFixed(1)}%</td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <button
                        onClick={() => setDeletingPlayer(player.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {deletingPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer ce joueur ? Cette action est irréversible et supprimera également tous ses scores.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeletingPlayer(null)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deletingPlayer)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 