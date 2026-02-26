import { useState, useMemo } from 'react';
import { ventasData, productosData, clientesData, calcularEstadisticas } from '../data/mockData';
import { formatCurrency, formatDate, exportToCSV } from '../utils/helpers';
import { Download, FileText, Calendar, TrendingUp } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export const Reportes = () => {
  const [rangoFecha, setRangoFecha] = useState('mes-actual');
  const [tipoReporte, setTipoReporte] = useState('ventas');

  // Calcular rango de fechas
  const { fechaInicio, fechaFin } = useMemo(() => {
    const hoy = new Date();
    
    switch (rangoFecha) {
      case 'hoy':
        return { fechaInicio: hoy, fechaFin: hoy };
      case 'ultimos-7':
        return { fechaInicio: subDays(hoy, 7), fechaFin: hoy };
      case 'ultimos-30':
        return { fechaInicio: subDays(hoy, 30), fechaFin: hoy };
      case 'mes-actual':
        return { fechaInicio: startOfMonth(hoy), fechaFin: endOfMonth(hoy) };
      case 'año-actual':
        return { fechaInicio: startOfYear(hoy), fechaFin: endOfYear(hoy) };
      default:
        return { fechaInicio: startOfMonth(hoy), fechaFin: endOfMonth(hoy) };
    }
  }, [rangoFecha]);

  // Filtrar ventas por rango
  const ventasFiltradas = useMemo(() => {
    return ventasData.filter((v) => {
      const fecha = new Date(v.fecha);
      return fecha >= fechaInicio && fecha <= fechaFin;
    });
  }, [fechaInicio, fechaFin]);

  const stats = useMemo(() => calcularEstadisticas(ventasFiltradas), [ventasFiltradas]);

  // Preparar datos para exportar según tipo de reporte
  const prepararDatosExportacion = () => {
    switch (tipoReporte) {
      case 'ventas':
        return ventasFiltradas.map((v) => ({
          ID: v.id,
          Fecha: formatDate(v.fecha),
          Producto: v.producto,
          Categoría: v.categoria,
          Cliente: v.cliente,
          Cantidad: v.cantidad,
          'Precio Unitario': v.precioUnitario,
          Total: v.total,
          Estado: v.estado,
        }));
      
      case 'productos':
        const productosConVentas = productosData.map((producto) => {
          const ventasProducto = ventasFiltradas.filter(
            (v) => v.productoId === producto.id && v.estado === 'Completada'
          );
          const unidadesVendidas = ventasProducto.reduce((sum, v) => sum + v.cantidad, 0);
          const ingresoTotal = ventasProducto.reduce((sum, v) => sum + v.total, 0);

          return {
            Producto: producto.nombre,
            Categoría: producto.categoria,
            Precio: producto.precio,
            'Unidades Vendidas': unidadesVendidas,
            'Ingresos Totales': ingresoTotal,
          };
        });
        return productosConVentas;
      
      case 'clientes':
        const clientesConVentas = clientesData.map((cliente) => {
          const comprasCliente = ventasFiltradas.filter(
            (v) => v.clienteId === cliente.id && v.estado === 'Completada'
          );
          const totalCompras = comprasCliente.length;
          const gastoTotal = comprasCliente.reduce((sum, v) => sum + v.total, 0);

          return {
            Cliente: cliente.nombre,
            Email: cliente.email,
            Ciudad: cliente.ciudad,
            'Total Compras': totalCompras,
            'Gasto Total': gastoTotal,
          };
        });
        return clientesConVentas;
      
      default:
        return [];
    }
  };

  const handleExportar = () => {
    const datos = prepararDatosExportacion();
    const nombreArchivo = `reporte-${tipoReporte}-${format(fechaInicio, 'yyyy-MM-dd')}-${format(fechaFin, 'yyyy-MM-dd')}`;
    exportToCSV(datos, nombreArchivo);
  };

  // Resumen por categoría
  const resumenCategorias = useMemo(() => {
    const categorias = {};
    ventasFiltradas
      .filter((v) => v.estado === 'Completada')
      .forEach((venta) => {
        if (!categorias[venta.categoria]) {
          categorias[venta.categoria] = { ventas: 0, ingresos: 0 };
        }
        categorias[venta.categoria].ventas += 1;
        categorias[venta.categoria].ingresos += venta.total;
      });

    return Object.entries(categorias)
      .map(([categoria, data]) => ({ categoria, ...data }))
      .sort((a, b) => b.ingresos - a.ingresos);
  }, [ventasFiltradas]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes</h1>
        <p className="text-gray-500 dark:text-gray-400">Genera y exporta reportes personalizados</p>
      </div>

      {/* Configuración de reporte */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configurar Reporte
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tipo de reporte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Reporte
            </label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="ventas">Reporte de Ventas</option>
              <option value="productos">Reporte de Productos</option>
              <option value="clientes">Reporte de Clientes</option>
            </select>
          </div>

          {/* Rango de fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Período
            </label>
            <select
              value={rangoFecha}
              onChange={(e) => setRangoFecha(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="hoy">Hoy</option>
              <option value="ultimos-7">Últimos 7 días</option>
              <option value="ultimos-30">Últimos 30 días</option>
              <option value="mes-actual">Mes actual</option>
              <option value="año-actual">Año actual</option>
            </select>
          </div>

          {/* Botón exportar */}
          <div className="flex items-end">
            <button
              onClick={handleExportar}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Info del período */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Calendar size={20} />
            <span className="text-sm font-medium">
              Período seleccionado: {formatDate(fechaInicio)} - {formatDate(fechaFin)}
            </span>
          </div>
        </div>
      </div>

      {/* Resumen de ventas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Ventas</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(stats.totalVentas)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.cantidadVentas}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={20} className="text-purple-600 dark:text-purple-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Ticket Promedio</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(stats.ticketPromedio)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-orange-600 dark:text-orange-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Registros</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {ventasFiltradas.length}
          </p>
        </div>
      </div>

      {/* Resumen por categoría */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Resumen por Categoría
        </h3>
        <div className="space-y-3">
          {resumenCategorias.map((item) => (
            <div
              key={item.categoria}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.categoria}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.ventas} ventas
                </p>
              </div>
              <p className="font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(item.ingresos)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};