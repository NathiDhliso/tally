import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import MainLayout from './layouts/MainLayout';
import {
  HomePage,
  InvoicesPage,
  ClientsPage,
  SettingsPage,
  InvoiceReviewPage,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="invoice/review" element={<InvoiceReviewPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
