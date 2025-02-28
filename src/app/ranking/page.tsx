'use client';

import RankingCard from '@/components/RankingCard';
import { usePlayers } from '@/contexts/PlayersContext';

export default function RankingPage() {
  const { players } = usePlayers();

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <div className="w-full md:w-1/3">
              <RankingCard
                title="Top 3 des points"
                players={players}
                getValue={(player) => player.points}
                formatValue={(value) => `${value}`}
                colorClass="bg-gradient-to-r from-orange-400 to-yellow-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RankingCard
              title="Top 3 des congos"
              players={players}
              getValue={(player) => player.congo}
              formatValue={(value) => `${value}`}
              colorClass="bg-gradient-to-r from-blue-400 to-cyan-400"
            />
            <RankingCard
              title="Top 3 des passages"
              players={players}
              getValue={(player) => player.passage}
              formatValue={(value) => `${value}`}
              colorClass="bg-gradient-to-r from-purple-400 to-pink-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 