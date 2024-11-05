import React, { useState, useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { AuthContext } from '../context/AuthContext';

interface Registro {
  id: number;
  hora: string;
  tipo: 'entrada' | 'salida';
}

interface TarjetonData {
  numero: number;
  placa?: string;
  color: 'rojo' | 'verde';
  registros: Registro[];
}

interface VisitanteData {
  placa: string;
  registros: Registro[];
}

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

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">Registro Vehicular de Tarjetones y Visitantes</h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <label className="flex items-center font-semibold">Fecha Bitácora:</label>
        <input type="date" value={fechaBitacora} onChange={(e) => setFechaBitacora(e.target.value)} className="p-2 border rounded w-full" />

        <label className="flex items-center font-semibold">Número de Tarjetón (001 - 250):</label>
        <input
          type="number"
          min="1"
          max="250"
          value={tarjeton}
          onChange={(e) => setTarjeton(e.target.value ? Number(e.target.value) : '')}
          placeholder="Escribe o selecciona"
          list="tarjeton-numeros"
          disabled={esVisitante}
          className="p-2 border rounded w-full"
        />
        <datalist id="tarjeton-numeros">
          {Array.from({ length: 250 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num.toString().padStart(3, '0')} />
          ))}
        </datalist>

        <label className="flex items-center font-semibold">Placa:</label>
        <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="Escribe la placa" className="p-2 border rounded w-full" required />

        <label className="flex items-center font-semibold">Color:</label>
        <select value={color} onChange={(e) => setColor(e.target.value as 'rojo' | 'verde')} disabled={esVisitante} className="p-2 border rounded w-full">
          <option value="rojo">Rojo</option>
          <option value="verde">Verde</option>
        </select>

        <label className="flex items-center font-semibold col-span-2 space-x-2">
        <input
          type="checkbox"
          checked={esVisitante}
          onChange={(e) => setEsVisitante(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 relative transition duration-300 ease-in-out">
          <span className="absolute left-1 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></span>
        </div>
        <span className="text-sm font-medium">Visitante</span>
        </label>

        <button type="button" onClick={() => manejarRegistro('entrada')} disabled={!isAuthenticated || (!esVisitante && tarjeton === '')} className="col-span-2 bg-blue-500 text-white p-2 rounded disabled:bg-gray-300">
          Entrada
        </button>
        <button type="button" onClick={() => manejarRegistro('salida')} disabled={!isAuthenticated || (!esVisitante && tarjeton === '')} className="col-span-2 bg-blue-500 text-white p-2 rounded disabled:bg-gray-300">
          Salida
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Tarjetones</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Número de Tarjetón</th>
            <th className="border p-2">Placa</th>
            <th className="border p-2">Color</th>
            <th className="border p-2">Última Entrada</th>
            <th className="border p-2">Última Salida</th>
          </tr>
        </thead>
        <tbody>
          {datosTarjetones.map((tarjeton) => {
            const ultimosRegistros = tarjeton.registros.slice(-2);
            const ultimaEntrada = ultimosRegistros.find((reg) => reg.tipo === 'entrada')?.hora || 'N/A';
            const ultimaSalida = ultimosRegistros.find((reg) => reg.tipo === 'salida')?.hora || 'N/A';

            return (
              <React.Fragment key={tarjeton.numero}>
                <tr onClick={() => toggleExpandido(tarjeton.numero.toString())} className="cursor-pointer hover:bg-gray-100">
                  <td className="border p-2 text-center">{tarjeton.numero}</td>
                  <td className="border p-2 text-center">{tarjeton.placa || 'N/A'}</td>
                  <td className="border p-2 text-center">{tarjeton.color}</td>
                  <td className="border p-2 text-center">{ultimaEntrada}</td>
                  <td className="border p-2 text-center">{ultimaSalida}</td>
                </tr>
                {expandido[tarjeton.numero.toString()] && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-gray-50">
                      <div>
                        <h4 className="font-semibold">Historial Completo</h4>
                        <ul className="list-disc list-inside">
                          {tarjeton.registros.map((registro) => (
                            <li key={registro.id}>
                              {registro.tipo === 'entrada' ? 'Entrada' : 'Salida'} - {registro.hora}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold my-4">Visitantes</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Placa</th>
            <th className="border p-2">Última Entrada</th>
            <th className="border p-2">Última Salida</th>
          </tr>
        </thead>
        <tbody>
          {datosVisitantes.map((visitante) => {
            const ultimosRegistros = visitante.registros.slice(-2);
            const ultimaEntrada = ultimosRegistros.find((reg) => reg.tipo === 'entrada')?.hora || 'N/A';
            const ultimaSalida = ultimosRegistros.find((reg) => reg.tipo === 'salida')?.hora || 'N/A';

            return (
              <React.Fragment key={visitante.placa}>
                <tr onClick={() => toggleExpandido(visitante.placa)} className="cursor-pointer hover:bg-gray-100">
                  <td className="border p-2 text-center">{visitante.placa}</td>
                  <td className="border p-2 text-center">{ultimaEntrada}</td>
                  <td className="border p-2 text-center">{ultimaSalida}</td>
                </tr>
                {expandido[visitante.placa] && (
                  <tr>
                    <td colSpan={3} className="p-4 bg-gray-50">
                      <div>
                        <h4 className="font-semibold">Historial Completo</h4>
                        <ul className="list-disc list-inside">
                          {visitante.registros.map((registro) => (
                            <li key={registro.id}>
                              {registro.tipo === 'entrada' ? 'Entrada' : 'Salida'} - {registro.hora}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {!isAuthenticated && (
        <div className="mt-12 p-4 bg-gray-100 text-center text-sm text-gray-700 border-t border-gray-300">
          <p>
            Por favor, <a href="/login" className="text-blue-500 hover:underline">inicia sesión</a> o{' '}
            <a href="/register" className="text-blue-500 hover:underline">regístrate</a> para poder guardar los datos.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
