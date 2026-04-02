import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-bold text-blue-600">
            💰 Finance Dashboard
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                {user?.role !== 'viewer' && (
                  <Link
                    to="/records"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Records
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/users"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Users
                  </Link>
                )}
                
                {/* Profile Icon with Role Badge */}
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <div className="bg-blue-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user?.role?.charAt(0).toUpperCase() || 'R'}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-black uppercase tracking-wider ${
                      user?.role === 'admin' ? 'text-purple-600' :
                      user?.role === 'analyst' ? 'text-blue-600' :
                      'text-gray-500'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
