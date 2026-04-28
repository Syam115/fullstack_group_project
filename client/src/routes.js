const routes = [
  { path: '/', label: 'Home', public: true },
  { path: '/doctors', label: 'Find Doctors', public: true },
  { path: '/login', label: 'Login', public: true },
  { path: '/register', label: 'Register', public: true },
  { path: '/appointments/history', label: 'Appointment History', roles: ['patient'] },
  { path: '/notifications', label: 'Notifications', roles: ['patient', 'doctor', 'admin'] },
  { path: '/dashboard/patient', label: 'Patient Dashboard', roles: ['patient'] },
  { path: '/dashboard/doctor', label: 'Doctor Dashboard', roles: ['doctor'] },
  { path: '/dashboard/admin', label: 'Admin Dashboard', roles: ['admin'] },
];

export default routes;
