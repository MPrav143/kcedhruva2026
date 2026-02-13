import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('adminToken');

    // Robust check for authentication token
    const isAuthenticated = token &&
        token !== 'undefined' &&
        token !== 'null' &&
        token.length > 10; // Token should be a real JWT string

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
