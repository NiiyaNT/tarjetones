// components/FormularioRegistro.tsx
import React from 'react';
import { FormularioRegistroProps } from '../types/types';

const FormularioRegistro: React.FC<FormularioRegistroProps> = ({
  tarjeton,
  setTarjeton,
  placa,
  setPlaca,
  color,
  setColor,
  esVisitante,
  setEsVisitante,
  manejarRegistro,
  isAuthenticated,
  fechaBitacora,
  setFechaBitacora,
}) => {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <label className="flex items-center font-semibold">Fecha Bitácora:</label>
      <input
        type="date"
        value={fechaBitacora}
        onChange={(e) => setFechaBitacora(e.target.value)}
        className="p-2 border rounded w-full"
      />

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
      <input
        type="text"
        value={placa}
        onChange={(e) => setPlaca(e.target.value)}
        placeholder="Escribe la placa"
        className="p-2 border rounded w-full"
        required
      />

      <label className="flex items-center font-semibold">Color:</label>
      <select
        value={color}
        onChange={(e) => setColor(e.target.value as 'rojo' | 'verde')}
        disabled={esVisitante}
        className="p-2 border rounded w-full"
      >
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

      <button
        type="button"
        onClick={() => manejarRegistro('entrada')}
        disabled={!isAuthenticated || (!esVisitante && tarjeton === '')}
        className="col-span-2 bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        Entrada
      </button>
      <button
        type="button"
        onClick={() => manejarRegistro('salida')}
        disabled={!isAuthenticated || (!esVisitante && tarjeton === '')}
        className="col-span-2 bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        Salida
      </button>
    </form>
  );
};

export default FormularioRegistro;
