import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/layout/Header';
import Footer from './components/Footer';
import SupportWidget from './components/SupportWidget';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Motivation from './pages/Motivation';
import Chat from './pages/Chat';
import VoiceGenerator from './pages/VoiceGenerator';
import Dashboard from './pages/Dashboard';
import Roast from './pages/Roast';
import Terms from './pages/Terms';
import APIDocumentation from './pages/APIDocumentation';
import AuthLanding from './pages/AuthLanding';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AnalyticsProvider>
            <NotificationProvider>
              <div className="min-h-screen bg-black text-white transition-colors duration-300">
                <Header />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/generator" element={<Generator />} />
                    <Route path="/roast" element={<Roast />} />
                    {/* Features page removed; Home now acts as the landing/features page */}
                    <Route path="/motivation" element={<Motivation />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/voice" element={<VoiceGenerator />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/auth" element={<AuthLanding />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Terms />} />
                    <Route path="/api-docs" element={<APIDocumentation />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <SupportWidget />
              </div>
            </NotificationProvider>
          </AnalyticsProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
