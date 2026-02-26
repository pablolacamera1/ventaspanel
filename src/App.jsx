import { Ventas } from './pages/Ventas';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { Productos } from './pages/Productos';
import { Clientes } from './pages/Clientes';
import { Reportes } from './pages/Reportes';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;