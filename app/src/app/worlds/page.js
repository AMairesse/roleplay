import { useEffect, useState } from 'react';
import { ProtectRoute } from '@/lib/auth';
import { getWorlds } from '@/lib/directus';


export default function Worlds() {
  const [worlds, setWorlds] = useState([]);

  useEffect(() => {
    const fetchWorlds = async () => {
      const data = await getWorlds(localStorage.getItem('token'));
      setWorlds(data);
    };
    fetchWorlds();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Vos Parties</h1>
      {worlds.length === 0 ? (
        <div className="text-center">
          <p>Vous n'avez pas encore de partie.</p>
          <button className="mt-4 p-2 bg-blue-500 text-white">Créer votre premier monde</button>
        </div>
      ) : (
        <div className="space-y-4">
          {worlds.map((world) => (
            <div key={world.id} className="p-4 border">
              <h2 className="text-xl font-semibold">{world.name}</h2>
              <p>{world.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
