import { create } from 'zustand';

interface UIStore {
  darkMode: boolean;
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  
  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  darkMode: false,
  isMobileMenuOpen: false,
  activeModal: null,

  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      // Apply dark mode class to document
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save to localStorage
      localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
      return { darkMode: newDarkMode };
    });
  },

  setDarkMode: (enabled) => {
    set({ darkMode: enabled });
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(enabled));
  },

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  
  openModal: (modalId) => set({ activeModal: modalId }),
  
  closeModal: () => set({ activeModal: null }),
}));
