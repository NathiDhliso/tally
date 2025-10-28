import { useState, useEffect } from 'react';
import type { User } from '../types';

// Placeholder auth hook
const useAuth = () => {
  const [user] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement actual auth logic
    setLoading(false);
  }, []);

  return { user, loading };
};

export default useAuth;
