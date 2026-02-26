import { KPICard } from '../components/KPICard';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { ventasData, calcularEstadisticas } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

export const Overview = () => {
  const stats = useMemo(() => calcularEstadisticas(ventasData), []);

  // Preparar datos para gráfico de ventas por mes
  const ventasPorMes = useMemo(() => {
    const meses = {};
    ventasData
      .filter((v) => v.estado === 'Completada')
      .forEach((venta) => {
        const mes = venta.fecha.toLocaleString('es-AR', { month: 'short', year: 'numeric' });
        if (!meses[mes]) {
          meses[mes] = 0;
        }
        meses[mes] += venta.total;
      });

    return Object.entries(meses)
      .map(([mes, total]) => ({ mes, total }))
      .slice(-6); // Últimos 6 meses
  }, []);

  // Preparar datos para gráfico de ventas por categoría
  const ventasPorCategoria = useMemo(() => {
    const categorias = {};
    ventasData
      .filter((v) => v.estado === 'Completada')
      .forEach((venta) => {
        if (!categorias[venta.categoria]) {
          categorias[venta.categoria] = 0;
        }
        categorias[venta.categoria] += venta.total;
      });

    return Object.entries(categorias).map(([name, value]) => ({ name, value }));
  }, []);

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Ventas Totales"
          value={formatCurrency(stats.totalVentas)}
          change={`${stats.crecimiento}%`}
          trend={parseFloat(stats.crecimiento) >= 0 ? 'up' : 'down'}
          icon={DollarSign}
        />
        <KPICard
          title="Cantidad de Ventas"
          value={stats.cantidadVentas}
          icon={ShoppingCart}
        />
        <KPICard
          title="Ticket Promedio"
          value={formatCurrency(stats.ticketPromedio)}
          icon={TrendingUp}
        />
        <KPICard
          title="Clientes Activos"
          value="245"
          change="+12%"
          trend="up"
          icon={Users}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de líneas - Ventas por mes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ventas por Mes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9CA3AF" />
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
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Ventas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de torta - Ventas por categoría */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ventas por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ventasPorCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ventasPorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top productos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Productos Más Vendidos
        </h3>
        <div className="space-y-3">
          {ventasData
            .filter((v) => v.estado === 'Completada')
            .reduce((acc, venta) => {
              const existing = acc.find((p) => p.producto === venta.producto);
              if (existing) {
                existing.total += venta.total;
                existing.cantidad += venta.cantidad;
              } else {
                acc.push({
                  producto: venta.producto,
                  total: venta.total,
                  cantidad: venta.cantidad,
                });
              }
              return acc;
            }, [])
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
            .map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.producto}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.cantidad} unidades vendidas
                  </p>
                </div>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};