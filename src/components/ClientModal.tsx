import { useState, useEffect } from 'react';
import { Button, Modal } from './index';
import { ClientSchema } from '../utils/validation';
import { useClientStore } from '../store/clientStore';
import { useToast } from '../contexts/ToastContext';
import type { Client } from '../types/client';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client;
  mode: 'add' | 'edit';
}

const ClientModal = ({ isOpen, onClose, client, mode }: ClientModalProps) => {
  const { addClient, updateClient } = useClientStore();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    }
    setErrors({});
  }, [client, mode, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const result = ClientSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = String(issue.path[0]);
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (mode === 'add') {
      addClient(formData);
      toast.success('Client added successfully!');
    } else if (client) {
      updateClient(client.id, formData);
      toast.success('Client updated successfully!');
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add Client' : 'Edit Client'}
      size="md"
      footer={
        <>
          <Button variant="outline" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="lg" onClick={handleSubmit}>
            {mode === 'add' ? 'Add Client' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Client Name <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="Enter client name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          />
          {errors.name && <p className="text-error-600 dark:text-error-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            placeholder="client@example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          />
          {errors.email && <p className="text-error-600 dark:text-error-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            placeholder="+27 11 123 4567"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          />
          {errors.phone && <p className="text-error-600 dark:text-error-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={e => handleChange('address', e.target.value)}
            placeholder="123 Main St, Johannesburg"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          />
          {errors.address && <p className="text-error-600 dark:text-error-400 text-sm mt-1">{errors.address}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default ClientModal;
