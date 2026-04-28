import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function ProtectedRoute({ children, roles = [] }) {
  const { userInfo } = useSelector(state => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(userInfo.role)) {
    return <Navigate to={`/dashboard/${userInfo.role}`} replace />;
  }

  return children;
}
