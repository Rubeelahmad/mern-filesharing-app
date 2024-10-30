import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import FileRedirect from './components/FileRedirect';
import Footer from './components/Footer';
import Header from './components/Header';
import { useAuth } from './context/authContext';
import FilesDashboard from './pages/FilesDashboard';
import FileStatistics
  from './pages/FileStatistics'; // Import the new FileStatistics page
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const { token } = useAuth();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/filesdashboard" />} />
          <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/filesdashboard" />} />
          <Route path="/redirect/:fileIdAndName" element={<FileRedirect />} />


          {/* Protected Routes */}
          <Route path="/filesdashboard" element={token ? <FilesDashboard /> : <Navigate to="/login" />} />
          <Route path="/statistics/:id" element={token ? <FileStatistics /> : <Navigate to="/login" />} />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to={token ? "/filesdashboard" : "/login"} />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;


