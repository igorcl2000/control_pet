import { AuthProvider } from '../contexts/AuthContext';
import type { Metadata } from 'next';
import '../styles/global.css';

export const metadata: Metadata = {
  title: 'Control PET',
  description: 'Control PET 1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}