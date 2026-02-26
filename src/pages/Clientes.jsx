import { useState, useMemo } from 'react';
import { clientesData, ventasData } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';
import { Users, ShoppingBag, TrendingUp } from 'lucide-react';

export const Clientes = () => {
  const [ordenamiento, setOrdenamiento] = useState('gastos-desc');

  // Calcular estadísticas por cliente
  const clientesConEstadisticas = useMemo(() => {
    return clientesData.map((cliente) => {
      const comprasCliente = ventasData.filter(
        (v) => v.clienteId === cliente.id && v.estado === 'Completada'
      );

      const totalCompras = comprasCliente.length;
      const gastoTotal = comprasCliente.reduce((sum, v) => sum + v.total, 0);
      const gastoPromedio = totalCompras > 0 ? gastoTotal / totalCompras : 0;

      // Última compra
      const ultimaCompra = comprasCliente.length > 0
        ? comprasCliente.sort((a, b) => b.fecha - a.fecha)[0].fecha
        : null;

      return {
        ...cliente,
        totalCompras,
        gastoTotal,
        gastoPromedio,
        ultimaCompra,
      };
    });
  }, []);

  // Ordenar clientes
  const clientesOrdenados = useMemo(() => {
    const resultado = [...clientesConEstadisticas];

    switch (ordenamiento) {
      case 'gastos-desc':
        resultado.sort((a, b) => b.gastoTotal - a.gastoTotal);
        break;
      case 'gastos-asc':
        resultado.sort((a, b) => a.gastoTotal - b.gastoTotal);
        break;
      case 'compras-desc':
        resultado.sort((a, b) => b.totalCompras - a.totalCompras);
        break;
      case 'compras-asc':
        resultado.sort((a, b) => a.totalCompras - b.totalCompras);
        break;
      case 'nombre':
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        break;
    }

    return resultado;
  }, [clientesConEstadisticas, ordenamiento]);

  // Calcular totales
  const totales = useMemo(() => {
    return clientesConEstadisticas.reduce(
      (acc, c) => ({
        clientes: acc.clientes + 1,
        compras: acc.compras + c.totalCompras,
        ingresos: acc.ingresos + c.gastoTotal,
      }),
      { clientes: 0, compras: 0, ingresos: 0 }
    );
  }, [clientesConEstadisticas]);

  const gastoPromedioGeneral = totales.clientes > 0 ? totales.ingresos / totales.clientes : 0;

  // Clasificar clientes por nivel de gasto
  const clasificarCliente = (gastoTotal) => {
    if (gastoTotal > 500000) return { nivel: 'VIP', color: 'purple' };
    if (gastoTotal > 200000) return { nivel: 'Premium', color: 'blue' };
    if (gastoTotal > 50000) return { nivel: 'Regular', color: 'green' };
    return { nivel: 'Nuevo', color: 'gray' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1>
        <p className="text-gray-500 dark:text-gray-400">Análisis y segmentación de clientes</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Total Clientes
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {totales.clientes}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Compras Totales
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {totales.compras}
              </h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <ShoppingBag size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Gasto Promedio
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(gastoPromedioGeneral)}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Ordenamiento */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ordenar por
        </label>
        <select
          value={ordenamiento}
          onChange={(e) => setOrdenamiento(e.target.value)}
          className="w-full md:w-64 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
        >
          <option value="gastos-desc">Gasto Total (mayor a menor)</option>
          <option value="gastos-asc">Gasto Total (menor a mayor)</option>
          <option value="compras-desc">Compras (más a menos)</option>
          <option value="compras-asc">Compras (menos a más)</option>
          <option value="nombre">Nombre (A-Z)</option>
        </select>
      </div>

      {/* Top 5 Clientes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 5 Clientes
        </h3>
        <div className="space-y-3">
          {clientesOrdenados.slice(0, 5).map((cliente, index) => {
            const clasificacion = clasificarCliente(cliente.gastoTotal);
            return (
              <div
                key={cliente.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {cliente.nombre}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {cliente.ciudad} • {cliente.totalCompras} compras
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(cliente.gastoTotal)}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full bg-${clasificacion.color}-100 text-${clasificacion.color}-800 dark:bg-${clasificacion.color}-900 dark:text-${clasificacion.color}-200`}
                  >
                    {clasificacion.nivel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Compras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Gasto Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Gasto Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nivel
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {clientesOrdenados.map((cliente) => {
                const clasificacion = clasificarCliente(cliente.gastoTotal);
                return (
                  <tr
                    key={cliente.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {cliente.nombre}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {cliente.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {cliente.ciudad}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {cliente.totalCompras}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(cliente.gastoTotal)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatCurrency(cliente.gastoPromedio)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          clasificacion.nivel === 'VIP'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : clasificacion.nivel === 'Premium'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : clasificacion.nivel === 'Regular'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {clasificacion.nivel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};