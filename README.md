# 📊 VentasPanel - Dashboard de Ventas y Métricas

Dashboard interactivo para visualización y análisis de ventas, productos y clientes con datos en tiempo real.

![VentasPanel](https://via.placeholder.com/800x400?text=Screenshot+aqui)

## 🚀 Características

### Páginas principales
- **📈 Overview** - Vista general con KPIs principales y gráficos de tendencias
- **💰 Ventas** - Tabla detallada de transacciones con búsqueda, filtros y ordenamiento
- **📦 Productos** - Análisis de productos más vendidos con estadísticas por categoría
- **👥 Clientes** - Segmentación de clientes (VIP, Premium, Regular) con análisis de comportamiento
- **📄 Reportes** - Generación y exportación de reportes personalizados por período

### Funcionalidades
- ✨ **Visualización de datos** con gráficos interactivos (líneas, barras, torta)
- 🔍 **Búsqueda y filtros avanzados** en todas las tablas
- 📊 **KPIs en tiempo real** (ventas totales, ticket promedio, crecimiento)
- 📥 **Exportación a CSV** de ventas, productos y clientes
- 📅 **Filtros por período** (hoy, últimos 7/30 días, mes actual, año)
- 🌙 **Dark mode** con persistencia en localStorage
- 📱 **Diseño responsive** optimizado para móvil, tablet y desktop
- 🎯 **Segmentación de clientes** por nivel de gasto
- 📈 **Análisis de tendencias** por mes y categoría

## 🛠️ Tecnologías utilizadas

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server ultrarrápido
- **React Router v6** - Navegación y routing
- **Tailwind CSS** - Framework de estilos utility-first
- **Recharts** - Librería de gráficos para React
- **Lucide React** - Iconos modernos
- **date-fns** - Manejo y formateo de fechas
- **Context API** - Gestión de estado global (dark mode)

## 📋 Requisitos previos

- Node.js 18 o superior
- npm o yarn

## ⚙️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/ventaspanel.git
cd ventaspanel
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:5173](http://localhost:5173) en el navegador

## 📦 Scripts disponibles
```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Crea build de producción
npm run preview  # Preview del build de producción
npm run lint     # Ejecuta el linter
```

## 🏗️ Estructura del proyecto
```
ventaspanel/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── KPICard.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── context/           # Context API
│   │   └── ThemeContext.jsx
│   ├── data/              # Datos mock
│   │   └── mockData.js
│   ├── pages/             # Páginas principales
│   │   ├── Overview.jsx
│   │   ├── Ventas.jsx
│   │   ├── Productos.jsx
│   │   ├── Clientes.jsx
│   │   └── Reportes.jsx
│   ├── utils/             # Funciones auxiliares
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── tailwind.config.js
└── README.md
```

## 📊 Datos mock

El dashboard utiliza datos simulados generados automáticamente que incluyen:
- **150 transacciones** de ventas con diferentes estados
- **12 productos** distribuidos en 8 categorías
- **10 clientes** con diferentes niveles de gasto
- Datos de ventas desde enero 2025 hasta la fecha actual

Los datos se generan aleatoriamente cada vez que se inicia la aplicación, proporcionando un entorno realista para testing.

## 🎨 Características destacadas

### Dashboard interactivo
KPIs principales con indicadores de crecimiento y comparación mensual.

### Visualización avanzada
Gráficos de líneas, barras y torta completamente interactivos con tooltips informativos.

### Exportación de datos
Descarga reportes en formato CSV con datos filtrados por período y tipo.

### Segmentación inteligente
Sistema de clasificación automática de clientes en 4 niveles:
- 🌟 **VIP** - Más de $500,000 en compras
- 💎 **Premium** - $200,000 - $500,000
- ✅ **Regular** - $50,000 - $200,000
- 🆕 **Nuevo** - Menos de $50,000

### Dark Mode
Tema oscuro completamente integrado que se guarda automáticamente.

## 🌐 Deploy

El proyecto está listo para ser deployado en:
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)

### Deploy en Vercel:
```bash
npm run build
vercel --prod
```

## 🔮 Futuras mejoras

- [ ] Integración con API backend real
- [ ] Autenticación de usuarios
- [ ] Filtros por rango de fechas personalizado
- [ ] Más tipos de gráficos (área, scatter)
- [ ] Comparación entre períodos
- [ ] Notificaciones en tiempo real
- [ ] Panel de administración de productos
- [ ] Exportación a PDF
- [ ] Métricas de inventario
- [ ] Dashboard personalizable (drag & drop)

## 📝 Licencia

MIT

## 👤 Autor

**Pablo Sebastián La Camera**
- GitHub: [@pablolacamera1](https://github.com/pablolacamera1)
- LinkedIn: [Tu LinkedIn](https://linkedin.com/in/pablolacamera)

## 🙏 Agradecimientos

- [Recharts](https://recharts.org/) por la excelente librería de gráficos
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de diseño
- [Lucide](https://lucide.dev/) por los iconos