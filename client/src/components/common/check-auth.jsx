import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
    const location = useLocation();

    // ✅ If on root, redirect based on auth state
    if (location.pathname === '/') {
        if (!isAuthenticated) {
            return <Navigate to='/auth/login' />;
        }
        if (user?.role === 'admin') {
            return <Navigate to='/admin/dashboard' />;
        }
        return <Navigate to='/shop/home' />;
    }

    // ✅ Not authenticated and trying to access protected route
    if (!isAuthenticated && 
        !location.pathname.includes('/login') && 
        !location.pathname.includes('/register')
    ) {
        return <Navigate to='/auth/login' state={{ from: location }} replace />;
    }

    // ✅ Authenticated and trying to access login/register
    if (isAuthenticated && (
        location.pathname.includes('/login') || 
        location.pathname.includes('/register')
    )) {
        if (user?.role === 'admin') {
            return <Navigate to='/admin/dashboard' />;
        }
        return <Navigate to='/shop/home' />;
    }

    // ✅ Non-admin trying to access admin routes
    if (isAuthenticated && user?.role !== 'admin' && 
        location.pathname.includes('admin')
    ) {
        return <Navigate to='/unauth-page' />;
    }

    // ✅ Admin trying to access shop routes
    if (isAuthenticated && user?.role === 'admin' && 
        location.pathname.includes('shop')
    ) {
        return <Navigate to='/admin/dashboard' />;
    }

    return <>{children}</>;
}

export default CheckAuth;