import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import MainLayout from './layouts/MainLayout';
import {
  HomePageUnified,
  InvoicesPage,
  ClientsPage,
  SettingsPage,
  InvoiceReviewPage,
} from './pages';
import { BrowserTestPanel } from './components/BrowserTestPanel';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Unified homepage - no layout wrapper for full control */}
            <Route index element={<HomePageUnified />} />
            
            {/* Other pages use MainLayout for navigation */}
            <Route path="/" element={<MainLayout />}>
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              {/* Keep legacy route for backwards compatibility */}
              <Route path="invoice/review" element={<InvoiceReviewPage />} />
              {/* Development-only route for browser testing */}
              <Route path="browser-test" element={<BrowserTestPanel />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
