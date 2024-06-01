import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Logique de déconnexion
    router.push('/login');
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">Déconnexion...</div>;
}
