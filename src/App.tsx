import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/navigation/Navbar';
import { AdminRoute } from './components/auth/AdminRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { MapPage } from './pages/MapPage';
import { WellDetails } from './pages/WellDetails';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { WaterIntelligence } from './pages/WaterIntelligence';

// Admin Pages
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminWells } from './admin/AdminWells';
import { AdminWater } from './admin/AdminWater';
import { AdminReports } from './admin/AdminReports';
import { AdminUsers } from './admin/AdminUsers';
import { AdminContent } from './admin/AdminContent';
import { AdminActivity } from './admin/AdminActivity';

// Helper component to reset scroll on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper to conditionally show navbar (not on admin screens)
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
    </>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <MainLayout>
            <Routes>
              {/* Public Citizen Portal Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/wells" element={<Explore />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/wells/:id" element={<WellDetails />} />
              <Route path="/water-intelligence" element={<WaterIntelligence />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />

              {/* Protected User Portal Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Dedicated Admin Login Gateway */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Separate Admin Portal */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="wells" element={<AdminWells />} />
                <Route path="water" element={<AdminWater />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="activity" element={<AdminActivity />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
