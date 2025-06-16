'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirecionamento automático baseado no status de autenticação
  useEffect(() => {
    if (isAuthenticated) {
      window.location.reload();
      router.push('/dashboard');
    } else {
      window.location.reload();
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Exibe um loader durante o redirecionamento
  return (
    <section className="hero is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="box">
                <div className="block">
                  <span className="icon is-large">
                    <i className="fas fa-circle-notch fa-spin fa-3x"></i>
                  </span>
                </div>
                <p className="title is-5">Verificando autenticação...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}