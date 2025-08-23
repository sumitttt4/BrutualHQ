import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Gallery from './pages/Gallery';
import MotivationTwist from './pages/MotivationTwist';
import Chat from './pages/Chat';
import VoiceGenerator from './pages/VoiceGenerator';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/explore" element={<Gallery />} />
            <Route path="/motivation" element={<MotivationTwist />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/voice" element={<VoiceGenerator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
