import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ServiceDetails from './components/ServiceDetails';
import HomePage from './Pages/HomePage';
import About from './Pages/About';
import Contactus from './Pages/Contactus';
import Admin from './Pages/Admin';
import Dashboard from './Pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/:serviceTitle" element={<ServiceDetails />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
