import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Context
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MapPage from './pages/MapPage';
import Dashboard from './pages/Dashboard';
import SavedLocations from './pages/SavedLocations';
import ClassSchedule from './pages/ClassSchedule';
import WalkingDirections from './pages/WalkingDirections';
import ShuttleTracker from './pages/ShuttleTracker';
import ParkingAssistant from './pages/ParkingAssistant';
import HelpCenter from './pages/HelpCenter';
import EmergencyServices from './pages/EmergencyServices';
import CampusDirectory from './pages/CampusDirectory';
import BuildingDirectory from './pages/BuildingDirectory';
import BuildingDetail from './pages/BuildingDetail';
import DepartmentSearch from './pages/DepartmentSearch';
import AdminPortal from './pages/AdminPortal';
import ManageBuildingData from './pages/ManageBuildingData';
import DispatchAlerts from './pages/DispatchAlerts';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public auth routes (no nav) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Main app routes with layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapPage />} />

            {/* Transit & Navigation */}
            <Route path="/directions" element={<WalkingDirections />} />
            <Route path="/shuttle" element={<ShuttleTracker />} />
            <Route path="/parking" element={<ParkingAssistant />} />

            {/* Safety & Support */}
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/emergency" element={<EmergencyServices />} />

            {/* Campus Directory */}
            <Route path="/directory" element={<CampusDirectory />} />
            <Route path="/directory/buildings" element={<BuildingDirectory />} />
            <Route path="/directory/buildings/:id" element={<BuildingDetail />} />
            <Route path="/directory/departments" element={<DepartmentSearch />} />

            {/* Protected: requires login */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/saved" element={<SavedLocations />} />
              <Route path="/schedule" element={<ClassSchedule />} />
            </Route>

            {/* Admin: requires admin role */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/admin/buildings" element={<ManageBuildingData />} />
              <Route path="/admin/alerts" element={<DispatchAlerts />} />
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
