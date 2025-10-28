import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import type { Client } from '../types/client';

interface ClientAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onClientSelect?: (client: Client) => void;
  clients: Client[];
  placeholder?: string;
}

const ClientAutocomplete = ({
  value,
  onChange,
  onClientSelect,
  clients,
  placeholder = 'Enter client name',
}: ClientAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Client[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Configure Fuse.js for fuzzy search
  const fuse = new Fuse(clients, {
    keys: ['name', 'email', 'phone'],
    threshold: 0.3, // 70% similarity required
    distance: 100,
    minMatchCharLength: 2,
  });

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.length >= 2) {
      const results = fuse.search(value);
      const topResults = results.slice(0, 5).map(result => result.item);
      setSuggestions(topResults);
      setIsOpen(topResults.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value, clients]);

  const handleSelect = (client: Client) => {
    onChange(client.name);
    onClientSelect?.(client);
    setIsOpen(false);
  };

  const formatLastUsed = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map(client => (
            <button
              key={client.id}
              type="button"
              onClick={() => handleSelect(client)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{client.name}</div>
                  {client.email && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">{client.email}</div>
                  )}
                  {client.phone && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">{client.phone}</div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatLastUsed(client.lastUsed)}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {client.usageCount} {client.usageCount === 1 ? 'invoice' : 'invoices'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientAutocomplete;
