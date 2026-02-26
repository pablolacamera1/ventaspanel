import { useState, useMemo } from 'react';
import { ventasData } from '../data/mockData';
import { formatCurrency, formatDate, exportToCSV } from '../utils/helpers';
import { Search, Download, Filter } from 'lucide-react';

export const Ventas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [ordenamiento, setOrdenamiento] = useState('fecha-desc');

  // Filtrar y ordenar ventas
  const ventasFiltradas = useMemo(() => {
    let resultado = [...ventasData];

    // Filtrar por búsqueda
    if (searchTerm) {
      resultado = resultado.filter(
        (venta) =>
          venta.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venta.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter((venta) => venta.estado === filtroEstado);
    }

    // Ordenar
    switch (ordenamiento) {
      case 'fecha-desc':
        resultado.sort((a, b) => b.fecha - a.fecha);
        break;
      case 'fecha-asc':
        resultado.sort((a, b) => a.fecha - b.fecha);
        break;
      case 'monto-desc':
        resultado.sort((a, b) => b.total - a.total);
        break;
      case 'monto-asc':
        resultado.sort((a, b) => a.total - b.total);
        break;
      default:
        break;
    }

    return resultado;
  }, [searchTerm, filtroEstado, ordenamiento]);

  // Calcular totales
  const totales = useMemo(() => {
    const completadas = ventasFiltradas.filter((v) => v.estado === 'Completada');
    return {
      total: completadas.reduce((sum, v) => sum + v.total, 0),
      cantidad: completadas.length,
    };
  }, [ventasFiltradas]);

  const handleExportar = () => {
    const dataParaExportar = ventasFiltradas.map((v) => ({
      ID: v.id,
      Fecha: formatDate(v.fecha),
      Producto: v.producto,
      Cliente: v.cliente,
      Cantidad: v.cantidad,
      'Precio Unitario': v.precioUnitario,
      Total: v.total,
      Estado: v.estado,
    }));
    exportToCSV(dataParaExportar, 'ventas');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ventas
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gestión de todas las transacciones
          </p>
        </div>
        <button
          onClick={handleExportar}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          Exportar CSV
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Ventas Completadas
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totales.total)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cantidad de Ventas
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totales.cantidad}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {ventasFiltradas.length} registros
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por producto o cliente..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            >
              <option value="todos">Todos</option>
              <option value="Completada">Completada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          {/* Ordenamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordenar por
            </label>
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            >
              <option value="fecha-desc">Fecha (más reciente)</option>
              <option value="fecha-asc">Fecha (más antigua)</option>
              <option value="monto-desc">Monto (mayor a menor)</option>
              <option value="monto-asc">Monto (menor a mayor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {ventasFiltradas.map((venta) => (
                <tr
                  key={venta.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #{venta.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(venta.fecha)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {venta.producto}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {venta.cliente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {venta.cantidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(venta.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        venta.estado === 'Completada'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : venta.estado === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {venta.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};