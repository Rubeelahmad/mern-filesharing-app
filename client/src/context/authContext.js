import {
  createContext,
  useContext,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
    
    export const AuthProvider = ({ children }) => {
      const [token, setToken] = useState(localStorage.getItem('token'));
      const navigate = useNavigate();
    
      const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        navigate('/filesdashboard');
      };
    
      const register = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        navigate('/filesdashboard');
      };
    
      const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login');
      };
    
      return (
        <AuthContext.Provider value={{ token, login, register, logout }}>
          {children}
        </AuthContext.Provider>
      );
    };
    
    export const useAuth = () => useContext(AuthContext);
    