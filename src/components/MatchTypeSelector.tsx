'use client'

interface MatchTypeSelectorProps {
  onSelect: (type: '1v1' | '2v2') => void
  onClose: () => void
}

export default function MatchTypeSelector({ onSelect, onClose }: MatchTypeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-6 text-center">Sélectionner le type de match</h2>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelect('1v1')}
            className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-semibold transition-colors"
          >
            1 contre 1
          </button>
          
          <button
            onClick={() => onSelect('2v2')}
            className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-semibold transition-colors"
          >
            2 contre 2
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors mt-4"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
} 