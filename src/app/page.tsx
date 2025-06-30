'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';

import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, checkAuth } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
    // Don't automatically show admin panel on authentication
  }, [checkAuth]);

  // Update admin panel visibility when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAdminPanel(false);
      setShowAdminLogin(false);
      setIsPreviewMode(false);
    }
  }, [isAuthenticated]);

  const handleAdminLogin = () => {
    setShowAdminLogin(false);
    setShowAdminPanel(true);
    setIsPreviewMode(false);
  };

  const handleAdminPreview = () => {
    setShowAdminPanel(false);
    setIsPreviewMode(true);
  };

  const handleBackToAdmin = () => {
    setIsPreviewMode(false);
    setShowAdminPanel(true);
  };

  const handleAdminClose = () => {
    setShowAdminPanel(false);
    setIsPreviewMode(false);
  };

  const handleAdminPanelAccess = () => {
    if (isAuthenticated) {
      setShowAdminPanel(true);
      setIsPreviewMode(false);
    } else {
      setShowAdminLogin(true);
    }
  };

  const shouldShowWebsite = !showAdminLogin && !showAdminPanel;

  return (
    <main className="min-h-screen">
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin 
          onClose={() => setShowAdminLogin(false)}
          onLogin={handleAdminLogin}
        />
      )}
      
      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel 
          onClose={handleAdminClose}
          onPreview={handleAdminPreview}
        />
      )}

      {/* Website Content */}
      {shouldShowWebsite && (
        <>
          {/* Preview Mode Banner */}
          {isPreviewMode && (
            <div className="bg-blue-600 text-white px-4 py-3 text-center relative">
              <span className="text-sm font-medium">
                Preview Mode - You are viewing the website as a visitor
              </span>
              <button
                onClick={handleBackToAdmin}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
              >
                Back to Admin
              </button>
            </div>
          )}
          
          <Navigation />
          <Hero />
          <Services />
          <About />
          <Contact />
          <Footer 
            onAdminClick={handleAdminPanelAccess}
          />
        </>
      )}
    </main>
  );
}
