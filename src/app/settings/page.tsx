'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

interface Settings {
  pointsPerVictory: number;
  pointsPerDefeat: number;
  notifications: boolean;
  language: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    pointsPerVictory: 10,
    pointsPerDefeat: 1,
    notifications: true,
    language: 'fr',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la sauvegarde des paramètres
    console.log('Paramètres sauvegardés:', settings);
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Paramètres</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configurez les paramètres de l'application selon vos besoins.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="pt-8">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Système de points</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configurez le nombre de points attribués pour les victoires et les défaites.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="pointsPerVictory" className="block text-sm font-medium text-gray-700">
                    Points par victoire
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="pointsPerVictory"
                      id="pointsPerVictory"
                      value={settings.pointsPerVictory}
                      onChange={(e) =>
                        setSettings({ ...settings, pointsPerVictory: parseInt(e.target.value) })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="pointsPerDefeat" className="block text-sm font-medium text-gray-700">
                    Points par défaite
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="pointsPerDefeat"
                      id="pointsPerDefeat"
                      value={settings.pointsPerDefeat}
                      onChange={(e) =>
                        setSettings({ ...settings, pointsPerDefeat: parseInt(e.target.value) })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Préférences</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Personnalisez votre expérience utilisateur.
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                    Activer les notifications
                  </label>
                </div>

                <div className="mt-6">
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Langue
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <Save className="h-5 w-5 mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 