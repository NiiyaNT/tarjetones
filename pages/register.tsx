import { useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const Register: NextPage = () => {
  const [usuario, setUsuario] = useState<string>('');
  const [contraseña, setContraseña] = useState<string>('');
  const router = useRouter();

  const manejarRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const respuesta = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contraseña }),
    });

    if (respuesta.ok) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      router.push('/login');
    } else {
      alert('Error en el registro. Inténtalo de nuevo.');
    }
  };

  return (
    <form onSubmit={manejarRegistro}>
      <h1>Registrarse</h1>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        required
      />
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;