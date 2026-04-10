import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorList from './pages/DoctorList';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/book" element={<BookAppointment />} />
        
        <Route path="/dashboard/patient" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/doctor" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
