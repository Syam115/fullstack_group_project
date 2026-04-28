import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorList from './pages/DoctorList';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import AppointmentHistory from './pages/AppointmentHistory';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/book" element={<ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>} />
            <Route
              path="/appointments/history"
              element={<ProtectedRoute roles={['patient']}><AppointmentHistory /></ProtectedRoute>}
            />
            <Route
              path="/notifications"
              element={<ProtectedRoute roles={['patient', 'doctor', 'admin']}><Notifications /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/patient"
              element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/doctor"
              element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/admin"
              element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
