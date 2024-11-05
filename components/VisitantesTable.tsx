// components/VisitantesTable.tsx
import React from 'react';
import { VisitantesTableProps } from '../types/types';

const VisitantesTable: React.FC<VisitantesTableProps> = ({ datosVisitantes, toggleExpandido, expandido }) => {
  return (
    <div>
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
    </div>
  );
};

export default VisitantesTable;
