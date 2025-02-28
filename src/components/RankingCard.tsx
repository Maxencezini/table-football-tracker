'use client'

import { Player } from '@/contexts/PlayersContext'
import Image from 'next/image'
import { Crown, Star } from 'lucide-react'

interface RankingCardProps {
  title: string
  players: Player[]
  getValue: (player: Player) => number
  formatValue: (value: number) => string
  colorClass: string
  limit?: number
}

export default function RankingCard({
  title,
  players,
  getValue,
  formatValue,
  colorClass,
  limit = 3
}: RankingCardProps) {
  const sortedPlayers = [...players]
    .sort((a, b) => getValue(b) - getValue(a))
    .slice(0, limit)

  // Calculer la valeur maximale pour la hauteur du podium
  const maxValue = Math.max(...sortedPlayers.map(player => getValue(player)))

  // Fonction pour calculer la hauteur relative
  const getHeightClass = (value: number) => {
    const percentage = (value / maxValue) * 100
    return `h-[${Math.max(percentage, 30)}%]`
  }

  return (
    <div className="bg-transparent p-4">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          {title}
        </h3>
        <div className="flex justify-center items-end gap-8 h-[230px]">
          {/* Position 3 */}
          {sortedPlayers[2] && (
            <div className={`flex flex-col items-center justify-end ${getHeightClass(getValue(sortedPlayers[2]))}`}>
              <div className="relative mb-4">
                <div className={`relative w-20 h-20 rounded-full bg-gradient-to-b from-green-400 to-green-600 p-0.5`}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={sortedPlayers[2].avatar}
                      alt={sortedPlayers[2].pseudo}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-green-400 text-xl flex items-center justify-center border-2 border-green-400 font-bold">
                    3
                  </div>
                </div>
              </div>
              <div className="text-gray-900 font-semibold text-lg mb-4">{sortedPlayers[2].pseudo}</div>
              <div className="text-2xl font-bold text-green-400">
                {formatValue(getValue(sortedPlayers[2]))}
              </div>
            </div>
          )}

          {/* Position 1 (Winner) */}
          {sortedPlayers[0] && (
            <div className={`flex flex-col items-center justify-end ${getHeightClass(getValue(sortedPlayers[0]))}`}>
              <div className="relative mb-4">
                <Crown className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-400 h-8 w-8" />
                <div className={`relative w-24 h-24 rounded-full bg-gradient-to-b from-yellow-400 to-orange-500 p-0.5`}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={sortedPlayers[0].avatar}
                      alt={sortedPlayers[0].pseudo}
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-yellow-400 text-2xl flex items-center justify-center border-2 border-yellow-400 font-bold">
                    1
                  </div>
                </div>
              </div>
              <div className="text-gray-900 font-semibold text-xl mb-4">{sortedPlayers[0].pseudo}</div>
              <div className="text-3xl font-bold text-yellow-400">
                {formatValue(getValue(sortedPlayers[0]))}
              </div>
            </div>
          )}

          {/* Position 2 */}
          {sortedPlayers[1] && (
            <div className={`flex flex-col items-center justify-end ${getHeightClass(getValue(sortedPlayers[1]))}`}>
              <div className="relative mb-4">
                <div className={`relative w-20 h-20 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 p-0.5`}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={sortedPlayers[1].avatar}
                      alt={sortedPlayers[1].pseudo}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-blue-400 text-xl flex items-center justify-center border-2 border-blue-400 font-bold">
                    2
                  </div>
                </div>
              </div>
              <div className="text-gray-900 font-semibold text-lg mb-4">{sortedPlayers[1].pseudo}</div>
              <div className="text-2xl font-bold text-blue-400">
                {formatValue(getValue(sortedPlayers[1]))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 