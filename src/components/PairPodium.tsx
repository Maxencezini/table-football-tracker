'use client'

import Image from 'next/image'
import { Crown, Star } from 'lucide-react'

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

interface PairPodiumProps {
  pairs: PlayerPair[]
  limit?: number
}

export default function PairPodium({ pairs, limit = 3 }: PairPodiumProps) {
  if (!Array.isArray(pairs) || pairs.length === 0) {
    return null;
  }

  const sortedPairs = [...pairs]
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, limit)

  // Calculer la valeur maximale pour la hauteur du podium
  const maxRatio = Math.max(...sortedPairs.map(pair => pair.ratio))

  // Fonction pour calculer la hauteur relative
  const getHeightClass = (ratio: number) => {
    const percentage = (ratio / maxRatio) * 100
    return `h-[${Math.max(percentage, 30)}%]`
  }

  return (
    <div className="bg-transparent p-4">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Top 3 des meilleures paires
        </h3>
        <div className="flex justify-center items-end gap-8 h-[230px]">
          {/* Position 3 */}
          {sortedPairs[2] && (
            <div className={`flex flex-col items-center justify-end ${getHeightClass(sortedPairs[2].ratio)}`}>
              <div className="relative mb-4">
                <div className={`relative w-24 h-20 rounded-full bg-gradient-to-b from-green-400 to-green-600 p-0.5`}>
                  <div className="relative w-full h-full">
                    {/* Premier avatar */}
                    <div className="absolute left-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={sortedPairs[2].player1.avatar}
                        alt={sortedPairs[2].player1.pseudo}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    </div>
                    {/* Deuxième avatar */}
                    <div className="absolute right-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={sortedPairs[2].player2.avatar}
                        alt={sortedPairs[2].player2.pseudo}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-green-400 text-xl flex items-center justify-center border-2 border-green-400 font-bold">
                    3
                  </div>
                </div>
              </div>
              <div className="text-gray-900 font-semibold text-lg mb-4">
                {`${sortedPairs[2].player1.pseudo} / ${sortedPairs[2].player2.pseudo}`}
              </div>
              <div className="text-2xl font-bold text-green-400">
                {(sortedPairs[2].ratio * 100).toFixed(1)}%
              </div>
            </div>
          )}

          {/* Position 1 (Winner) */}
          {sortedPairs[0] && (
            <div className={`flex flex-col items-center justify-end ${getHeightClass(sortedPairs[0].ratio)}`}>
              <div className="relative mb-4">
                <Crown className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-400 h-8 w-8" />
                <div className={`relative w-28 h-24 rounded-full bg-gradient-to-b from-yellow-400 to-orange-500 p-0.5`}>
                  <div className="relative w-full h-full">
                    {/* Premier avatar */}
                    <div className="absolute left-0 w-20 h-20 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={sortedPairs[0].player1.avatar}
                        alt={sortedPairs[0].player1.pseudo}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    </div>
                    {/* Deuxième avatar */}
                    <div className="absolute right-0 w-20 h-20 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={sortedPairs[0].player2.avatar}
                        alt={sortedPairs[0].player2.pseudo}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-yellow-400 text-2xl flex items-center justify-center border-2 border-yellow-400 font-bold">
                    1
                  </div>
                </div>
              </div>
              <div className="text-gray-900 font-semibold text-xl mb-4">
                {`${sortedPairs[0].player1.pseudo} / ${sortedPairs[0].player2.pseudo}`}
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                {(sortedPairs[0].ratio * 100).toFixed(1)}%
              </div>
            </div>
          )}

          {/* Position 2 */}
          {sortedPairs[1] && (
            <div className={`flex flex-col items-center justify-end ${getHeightClass(sortedPairs[1].ratio)}`}>
              <div className="relative mb-4">
                <div className={`relative w-24 h-20 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 p-0.5`}>
                  <div className="relative w-full h-full">
                    {/* Premier avatar */}
                    <div className="absolute left-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={sortedPairs[1].player1.avatar}
                        alt={sortedPairs[1].player1.pseudo}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    </div>
                    {/* Deuxième avatar */}
                    <div className="absolute right-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={sortedPairs[1].player2.avatar}
                        alt={sortedPairs[1].player2.pseudo}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-blue-400 text-xl flex items-center justify-center border-2 border-blue-400 font-bold">
                    2
                  </div>
                </div>
              </div>
              <div className="text-gray-900 font-semibold text-lg mb-4">
                {`${sortedPairs[1].player1.pseudo} / ${sortedPairs[1].player2.pseudo}`}
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {(sortedPairs[1].ratio * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 