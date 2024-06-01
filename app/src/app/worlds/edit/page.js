import { useState } from 'react';

export default function EditWorld() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [games, setGames] = useState([{ id: Date.now(), title: '' }]);

  const handleAddMission = () => {
    setGames([...games, { id: Date.now(), title: '' }]);
  };

  const handleMissionChange = (index, value) => {
    const newGames = games.slice();
    newGames[index].title = value;
    setGames(newGames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique de création/édition de projet avec l'API Directus
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Créer / Éditer un Monde</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Parties</h2>
          {games.map((game, index) => (
            <div key={game.id} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={game.title}
                onChange={(e) => handleMissionChange(index, e.target.value)}
                className="flex-1 p-2 border"
              />
            </div>
          ))}
          <button type="button" onClick={handleAddMission} className="p-2 bg-blue-500 text-white">
            Ajouter une game
          </button>
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}
