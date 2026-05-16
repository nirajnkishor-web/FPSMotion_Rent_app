import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Upload from './pages/Upload';
import BookAppointment from './pages/BookAppointment';
import SearchPage from './pages/SearchPage';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import AccountRecovery from './pages/AccountRecovery';
import Contact from './pages/Contact';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/buy" element={<Layout><SearchPage /></Layout>} />
        <Route path="/rent" element={<Layout><SearchPage /></Layout>} />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <Layout><Upload /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/book" 
          element={
            <ProtectedRoute>
              <Layout><BookAppointment /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/property/:id" element={<Layout><PropertyDetail /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
        <Route path="/recover-account" element={<Layout><AccountRecovery /></Layout>} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
