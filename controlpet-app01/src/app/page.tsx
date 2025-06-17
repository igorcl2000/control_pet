'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === true) {
      router.push('/dashboard');
    } else if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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
