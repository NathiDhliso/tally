import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BusinessData {
  name: string;
  email: string;
  phone: string;
  address: string;
  vatNumber: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
  paymentTerms: string;
}

interface SettingsStore {
  businessData: BusinessData;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  resetBusinessData: () => void;
}

const defaultBusinessData: BusinessData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  vatNumber: '',
  bankName: '',
  accountNumber: '',
  branchCode: '',
  paymentTerms: 'Payment due within 30 days',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      businessData: defaultBusinessData,
      
      updateBusinessData: (data) =>
        set((state) => ({
          businessData: { ...state.businessData, ...data },
        })),
      
      resetBusinessData: () =>
        set({ businessData: defaultBusinessData }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
