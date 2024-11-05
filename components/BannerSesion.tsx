// components/BannerSesion.tsx
import React from 'react';
import { BannerSesionProps } from '../types/types';

const BannerSesion: React.FC<BannerSesionProps> = ({ isAuthenticated }) => {
  if (isAuthenticated) return null;

  return (
    <div className="mt-12 p-4 bg-gray-100 text-center text-sm text-gray-700 border-t border-gray-300">
      <p>
        Por favor, <a href="/login" className="text-blue-500 hover:underline">inicia sesión</a> o{' '}
        <a href="/register" className="text-blue-500 hover:underline">regístrate</a> para poder guardar los datos.
      </p>
    </div>
  );
};

export default BannerSesion;
