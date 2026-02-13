import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalConfigProvider } from './context/GlobalConfigContext';
import { Suspense, lazy } from 'react';
import Loader from './components/Loader';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminSignup = lazy(() => import('./pages/AdminSignup'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ManageEvents = lazy(() => import('./pages/ManageEvents'));
const ManageImages = lazy(() => import('./pages/ManageImages'));
const ManagePasses = lazy(() => import('./pages/ManagePasses'));
const ManageContent = lazy(() => import('./pages/ManageContent'));
const Passes = lazy(() => import('./pages/Passes'));
const RegisterEvent = lazy(() => import('./pages/RegisterEvent'));
const EventSelection = lazy(() => import('./pages/EventSelection'));
const LiveConcert = lazy(() => import('./pages/LiveConcert'));
const PrincipalDashboard = lazy(() => import('./pages/PrincipalDashboard'));
const HodDashboard = lazy(() => import('./pages/HodDashboard'));

const EventDetail = lazy(() => import('./pages/EventDetail'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <GlobalConfigProvider>
        <div className="min-h-screen bg-[#0a0a0a]">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader text="Loading..." /></div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Home />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/passes" element={<Passes />} />
              <Route path="/register/:eventId" element={<RegisterEvent />} />
              <Route path="/select-events" element={<EventSelection />} />
              <Route path="/live-concert" element={<LiveConcert />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/signup" element={<AdminSignup />} />
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />

              {/* Protected Admin Routes */}
              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                {[
                  { path: 'dashboard', element: <AdminDashboard /> },
                  { path: 'analytics', element: <PrincipalDashboard /> },
                  { path: 'department', element: <HodDashboard /> },
                  { path: 'events', element: <ManageEvents /> },
                  { path: 'events/:category', element: <ManageEvents /> },
                  { path: 'events/:category/:subcategory', element: <ManageEvents /> },
                  { path: 'images', element: <ManageImages /> },
                  { path: 'passes', element: <ManagePasses /> },
                  { path: 'content', element: <ManageContent /> },
                ].map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Route>
            </Routes>
          </Suspense>
          <Chatbot />
        </div>
      </GlobalConfigProvider>
    </Router>
  );
}

export default App;
