'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import PairPodium from '@/components/PairPodium'
import Pagination from '@/components/Pagination'

interface Player {
  id: number
  pseudo: string
  avatar: string
}

interface PlayerPair {
  id: number
  player1: Player
  player2: Player
  victories: number
  defeats: number
  ratio: number
  congo: number
  passage: number
}

export default function PairsPage() {
  const [pairs, setPairs] = useState<PlayerPair[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const response = await fetch('/api/pairs')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des paires')
        }
        const data = await response.json()
        setPairs(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Erreur lors du chargement des paires:', error)
        setPairs([])
      } finally {
        setLoading(false)
      }
    }

    fetchPairs()
  }, [])

  const handleGeneratePairs = async () => {
    try {
      const response = await fetch('/api/pairs/generate', {
        method: 'POST',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }
      alert(data.message)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération des paires')
    }
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  if (pairs.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Aucune paire de joueurs disponible
        </div>
      </div>
    )
  }

  // Trier les paires par ratio décroissant
  const sortedPairs = [...pairs].sort((a, b) => b.ratio - a.ratio)
  const totalPages = Math.ceil(sortedPairs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentPairs = sortedPairs.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Statistiques des paires</h1>
        <button
          onClick={handleGeneratePairs}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Générer les paires manquantes
        </button>
      </div>
      <div className="mb-8">
        <PairPodium pairs={pairs} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joueurs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pseudo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Victoires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Défaites</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Congo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ratio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPairs.map((pair) => (
              <tr key={pair.id} className="h-20">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center h-full">
                    <div className="relative w-16">
                      {/* Premier avatar */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10">
                        <Image
                          className="rounded-full border-2 border-white"
                          src={pair.player1.avatar}
                          alt={pair.player1.pseudo}
                          width={40}
                          height={40}
                        />
                      </div>
                      {/* Deuxième avatar */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-6">
                        <Image
                          className="rounded-full border-2 border-white"
                          src={pair.player2.avatar}
                          alt={pair.player2.pseudo}
                          width={40}
                          height={40}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {`${pair.player1.pseudo} / ${pair.player2.pseudo}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pair.victories}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pair.defeats}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.floor(pair.congo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pair.passage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(pair.ratio * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
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
  )
} 