import "../app/globals.css"; // Ajusta la ruta según tu archivo CSS global
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;