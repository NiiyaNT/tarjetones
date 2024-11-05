// components/TarjetonesTable.tsx
import React from 'react';
import { TarjetonesTableProps } from '../types/types';

const TarjetonesTable: React.FC<TarjetonesTableProps> = ({ datosTarjetones, toggleExpandido, expandido }) => {
  return (
    <div>
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
    </div>
  );
};

export default TarjetonesTable;
