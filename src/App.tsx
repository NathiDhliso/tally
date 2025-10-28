import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { HomePageUnified } from './pages';
import { BrowserTestPanel } from './components/BrowserTestPanel';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Unified single-page application - all states managed internally */}
            <Route path="/" element={<HomePageUnified />} />
            
            {/* Development-only route for browser testing */}
            <Route path="/browser-test" element={<BrowserTestPanel />} />
            
            {/* Catch-all: redirect to home */}
            <Route path="*" element={<HomePageUnified />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
