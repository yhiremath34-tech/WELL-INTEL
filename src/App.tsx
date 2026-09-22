import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/navigation/Navbar';

// Public Pages
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { MapPage } from './pages/MapPage';
import { WellDetails } from './pages/WellDetails';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminWells } from './admin/AdminWells';
import { AdminReports } from './admin/AdminReports';
import { AdminUsers } from './admin/AdminUsers';

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
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/wells/:id" element={<WellDetails />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route path="/profile" element={<Profile />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="wells" element={<AdminWells />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="users" element={<AdminUsers />} />
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
