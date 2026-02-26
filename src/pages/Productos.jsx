import { useState, useMemo } from 'react';
import { productosData, ventasData } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';
import { Package, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Productos = () => {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  // Calcular estadísticas por producto
  const productosConEstadisticas = useMemo(() => {
    return productosData.map((producto) => {
      const ventasProducto = ventasData.filter(
        (v) => v.productoId === producto.id && v.estado === 'Completada'
      );

      const unidadesVendidas = ventasProducto.reduce((sum, v) => sum + v.cantidad, 0);
      const ingresoTotal = ventasProducto.reduce((sum, v) => sum + v.total, 0);

      return {
        ...producto,
        unidadesVendidas,
        ingresoTotal,
        stockDisponible: Math.floor(Math.random() * 100) + 10, // Stock simulado
      };
    });
  }, []);

  // Filtrar por categoría
  const productosFiltrados = useMemo(() => {
    if (categoriaFiltro === 'todas') return productosConEstadisticas;
    return productosConEstadisticas.filter((p) => p.categoria === categoriaFiltro);
  }, [productosConEstadisticas, categoriaFiltro]);

  // Obtener categorías únicas
  const categorias = useMemo(() => {
    return ['todas', ...new Set(productosData.map((p) => p.categoria))];
  }, []);

  // Top 5 productos por ingresos
  const topProductos = useMemo(() => {
    return [...productosConEstadisticas]
      .sort((a, b) => b.ingresoTotal - a.ingresoTotal)
      .slice(0, 5)
      .map((p) => ({
        nombre: p.nombre,
        ingresos: p.ingresoTotal,
      }));
  }, [productosConEstadisticas]);

  // Calcular totales
  const totales = useMemo(() => {
    return productosFiltrados.reduce(
      (acc, p) => ({
        productos: acc.productos + 1,
        ingresos: acc.ingresos + p.ingresoTotal,
        unidades: acc.unidades + p.unidadesVendidas,
      }),
      { productos: 0, ingresos: 0, unidades: 0 }
    );
  }, [productosFiltrados]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Productos</h1>
        <p className="text-gray-500 dark:text-gray-400">Análisis de productos y categorías</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Total Productos
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {totales.productos}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Package size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Unidades Vendidas
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {totales.unidades}
              </h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Ingresos Totales
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totales.ingresos)}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <DollarSign size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtro por categoría */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filtrar por categoría
        </label>
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="w-full md:w-64 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'todas' ? 'Todas las categorías' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Gráfico de Top Productos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 5 Productos por Ingresos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProductos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="nombre" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => formatCurrency(value)}
            />
            <Bar dataKey="ingresos" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unidades Vendidas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ingresos Totales
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {productosFiltrados
                .sort((a, b) => b.ingresoTotal - a.ingresoTotal)
                .map((producto) => (
                  <tr
                    key={producto.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {producto.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {producto.categoria}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatCurrency(producto.precio)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          producto.stockDisponible > 50
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : producto.stockDisponible > 20
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {producto.stockDisponible} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {producto.unidadesVendidas}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(producto.ingresoTotal)}
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