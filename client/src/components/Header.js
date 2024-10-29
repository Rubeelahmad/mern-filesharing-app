import { Link } from 'react-router-dom';

import { useAuth } from '../context/authContext';

const Header = () => {
  const { token, logout } = useAuth();

  return (
    <header className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-2xl font-semibold">MERN File Sharing App</h1>
      <nav>
        {token ? (
          <>
            <Link to="/filesdashboard" className="mr-4 hover:text-gray-300">Files Dashboard</Link>
            <button onClick={logout} className="hover:text-gray-300">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:text-gray-300">Login</Link>
            <Link to="/signup" className="hover:text-gray-300">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;

