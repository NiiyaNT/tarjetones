// pages/index.tsx
import React, { useState, useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { AuthContext } from '../context/AuthContext';
import FormularioRegistro from '../components/FormularioRegistro';
import TarjetonesTable from '../components/TarjetonesTable';
import VisitantesTable from '../components/VisitantesTable';
import BannerSesion from '../components/BannerSesion';
import { TarjetonData, VisitanteData, Registro } from '../types/types';

const Home: NextPage = () => {
  const [tarjeton, setTarjeton] = useState<number | ''>('');
  const [placa, setPlaca] = useState<string>('');
  const [color, setColor] = useState<'rojo' | 'verde'>('rojo');
  const [esVisitante, setEsVisitante] = useState<boolean>(false);
  const [fechaBitacora, setFechaBitacora] = useState<string>(new Date().toISOString().split('T')[0]);
  const [datosTarjetones, setDatosTarjetones] = useState<TarjetonData[]>([]);
  const [datosVisitantes, setDatosVisitantes] = useState<VisitanteData[]>([]);
  const [expandido, setExpandido] = useState<{ [key: string]: boolean }>({});
  const { isAuthenticated } = useContext(AuthContext);

  const manejarRegistro = async (tipo: 'entrada' | 'salida') => {
    if (!isAuthenticated) return;
  
    const hora = new Date().toISOString();
    const nuevoRegistro: Registro = { id: Date.now(), hora, tipo };
  
    if (esVisitante && placa) {
      setDatosVisitantes((prevDatos) => {
        const actualizado = [...prevDatos];
        const index = actualizado.findIndex((v) => v.placa === placa);
        if (index > -1) {
          actualizado[index].registros.push(nuevoRegistro);
        } else {
          actualizado.push({ placa, registros: [nuevoRegistro] });
        }
        return actualizado;
      });
    } else if (!esVisitante && tarjeton) {
      setDatosTarjetones((prevDatos) => {
        const actualizado = [...prevDatos];
        const index = actualizado.findIndex((t) => t.numero === tarjeton);
        if (index > -1) {
          actualizado[index].registros.push(nuevoRegistro);
        } else {
          actualizado.push({ numero: tarjeton, placa, color, registros: [nuevoRegistro] });
        }
        return actualizado;
      });
    }
  };
  
  const toggleExpandido = (id: string) => {
    setExpandido((prevExpandido) => ({
      ...prevExpandido,
      [id]: !prevExpandido[id],
    }));
  };


  useEffect(() => {
    if (isAuthenticated) {
      fetch(`/api/tarjetones?fechaBitacora=${fechaBitacora}`)
        .then((res) => res.json())
        .then((data: TarjetonData[]) => setDatosTarjetones(data))
        .catch((err) => console.error(err));

      fetch(`/api/visitantes?fechaBitacora=${fechaBitacora}`)
        .then((res) => res.json())
        .then((data: VisitanteData[]) => setDatosVisitantes(data))
        .catch((err) => console.error(err));
    } else {
      setDatosTarjetones([]);
      setDatosVisitantes([]);
    }
  }, [fechaBitacora, isAuthenticated]);

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">Registro Vehicular de Tarjetones y Visitantes</h1>

      <FormularioRegistro
        tarjeton={tarjeton}
        setTarjeton={setTarjeton}
        placa={placa}
        setPlaca={setPlaca}
        color={color}
        setColor={setColor}
        esVisitante={esVisitante}
        setEsVisitante={setEsVisitante}
        manejarRegistro={manejarRegistro}
        isAuthenticated={isAuthenticated}
        fechaBitacora={fechaBitacora}
        setFechaBitacora={setFechaBitacora}
      />

      <TarjetonesTable datosTarjetones={datosTarjetones} toggleExpandido={toggleExpandido} expandido={expandido} />
      <VisitantesTable datosVisitantes={datosVisitantes} toggleExpandido={toggleExpandido} expandido={expandido} />
      <BannerSesion isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default Home;