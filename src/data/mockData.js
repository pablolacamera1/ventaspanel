// Generar datos aleatorios para el dashboard

// Función helper para generar fecha aleatoria
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Productos disponibles
const productos = [
  { id: 1, nombre: 'Laptop HP', categoria: 'Electrónica', precio: 45000 },
  { id: 2, nombre: 'Mouse Logitech', categoria: 'Accesorios', precio: 2500 },
  { id: 3, nombre: 'Teclado Mecánico', categoria: 'Accesorios', precio: 8000 },
  { id: 4, nombre: 'Monitor Samsung 24"', categoria: 'Electrónica', precio: 35000 },
  { id: 5, nombre: 'Auriculares Sony', categoria: 'Audio', precio: 12000 },
  { id: 6, nombre: 'Webcam Logitech', categoria: 'Accesorios', precio: 15000 },
  { id: 7, nombre: 'SSD 1TB', categoria: 'Almacenamiento', precio: 18000 },
  { id: 8, nombre: 'RAM 16GB', categoria: 'Componentes', precio: 22000 },
  { id: 9, nombre: 'Smartphone Samsung', categoria: 'Telefonía', precio: 95000 },
  { id: 10, nombre: 'Tablet iPad', categoria: 'Electrónica', precio: 125000 },
  { id: 11, nombre: 'Impresora HP', categoria: 'Oficina', precio: 28000 },
  { id: 12, nombre: 'Router TP-Link', categoria: 'Redes', precio: 6500 },
];

// Clientes
const clientes = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', ciudad: 'Buenos Aires' },
  { id: 2, nombre: 'María García', email: 'maria@email.com', ciudad: 'Córdoba' },
  { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', ciudad: 'Rosario' },
  { id: 4, nombre: 'Ana Martínez', email: 'ana@email.com', ciudad: 'Mendoza' },
  { id: 5, nombre: 'Pedro Rodríguez', email: 'pedro@email.com', ciudad: 'La Plata' },
  { id: 6, nombre: 'Laura Fernández', email: 'laura@email.com', ciudad: 'Tucumán' },
  { id: 7, nombre: 'Diego Sánchez', email: 'diego@email.com', ciudad: 'Salta' },
  { id: 8, nombre: 'Sofía Gómez', email: 'sofia@email.com', ciudad: 'Mar del Plata' },
  { id: 9, nombre: 'Martín Díaz', email: 'martin@email.com', ciudad: 'San Juan' },
  { id: 10, nombre: 'Valentina Ruiz', email: 'valentina@email.com', ciudad: 'Neuquén' },
];

// Estados de venta
const estados = ['Completada', 'Pendiente', 'Cancelada'];

// Generar ventas aleatorias
const generarVentas = (cantidad = 100) => {
  const ventas = [];
  const fechaInicio = new Date(2025, 0, 1); // 1 de enero 2025
  const fechaFin = new Date(); // Hoy

  for (let i = 0; i < cantidad; i++) {
    const producto = productos[Math.floor(Math.random() * productos.length)];
    const cliente = clientes[Math.floor(Math.random() * clientes.length)];
    const cantidad_vendida = Math.floor(Math.random() * 5) + 1;
    const estado = estados[Math.floor(Math.random() * estados.length)];
    const fecha = randomDate(fechaInicio, fechaFin);

    ventas.push({
      id: i + 1,
      fecha: fecha,
      producto: producto.nombre,
      productoId: producto.id,
      categoria: producto.categoria,
      cliente: cliente.nombre,
      clienteId: cliente.id,
      cantidad: cantidad_vendida,
      precioUnitario: producto.precio,
      total: producto.precio * cantidad_vendida,
      estado: estado,
    });
  }

  return ventas.sort((a, b) => b.fecha - a.fecha); // Ordenar por fecha descendente
};

// Generar las ventas
export const ventasData = generarVentas(150);

// Exportar productos y clientes
export const productosData = productos;
export const clientesData = clientes;

// Calcular estadísticas
export const calcularEstadisticas = (ventas) => {
  const ventasCompletadas = ventas.filter(v => v.estado === 'Completada');
  
  const totalVentas = ventasCompletadas.reduce((sum, v) => sum + v.total, 0);
  const cantidadVentas = ventasCompletadas.length;
  const ticketPromedio = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

  // Ventas del mes actual
  const mesActual = new Date().getMonth();
  const añoActual = new Date().getFullYear();
  const ventasMesActual = ventasCompletadas.filter(v => 
    v.fecha.getMonth() === mesActual && v.fecha.getFullYear() === añoActual
  );
  const totalMesActual = ventasMesActual.reduce((sum, v) => sum + v.total, 0);

  // Ventas del mes anterior
  const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
  const añoMesAnterior = mesActual === 0 ? añoActual - 1 : añoActual;
  const ventasMesAnterior = ventasCompletadas.filter(v => 
    v.fecha.getMonth() === mesAnterior && v.fecha.getFullYear() === añoMesAnterior
  );
  const totalMesAnterior = ventasMesAnterior.reduce((sum, v) => sum + v.total, 0);

  // Calcular crecimiento
  const crecimiento = totalMesAnterior > 0 
    ? ((totalMesActual - totalMesAnterior) / totalMesAnterior) * 100 
    : 0;

  return {
    totalVentas,
    cantidadVentas,
    ticketPromedio,
    totalMesActual,
    crecimiento: crecimiento.toFixed(1),
  };
};