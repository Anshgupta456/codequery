import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import Home from './pages/public/Home';
import Projects from './pages/public/Projects';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProfile from './pages/admin/ManageProfile';
import ManageProjects from './pages/admin/ManageProjects';
import ManageExperience from './pages/admin/ManageExperience';
import ManageSkills from './pages/admin/ManageSkills';
import ManageEducation from './pages/admin/ManageEducation';
import ManageAchievements from './pages/admin/ManageAchievements';
import Messages from './pages/admin/Messages';

export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirect /admin to /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ManageProfile />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="experience" element={<ManageExperience />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="achievements" element={<ManageAchievements />} />
            <Route path="messages" element={<Messages />} />
          </Route>

          {/* Fallback Wildcard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
}
