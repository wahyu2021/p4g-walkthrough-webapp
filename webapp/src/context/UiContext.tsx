import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Toast } from '../components/molecules/Toast';
import type { ToastType } from '../components/molecules/Toast';
import { ConfirmModal } from '../components/molecules/ConfirmModal';
import type { ConfirmOptions } from '../components/molecules/ConfirmModal';

type UiContextType = {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
};

const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: ReactNode }) {
  // State untuk Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  // State untuk Confirm Modal
  const [confirm, setConfirm] = useState<{
    options: ConfirmOptions | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    options: null,
    resolve: null,
  });

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirm({ options, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirm.resolve) confirm.resolve(true);
    setConfirm({ options: null, resolve: null });
  }, [confirm]);

  const handleCancel = useCallback(() => {
    if (confirm.resolve) confirm.resolve(false);
    setConfirm({ options: null, resolve: null });
  }, [confirm]);

  return (
    <UiContext.Provider value={{ showToast, showConfirm }}>
      {children}
      
      {/* Komponen Mengambang Global */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        visible={toast.visible} 
        onClose={hideToast} 
      />
      
      <ConfirmModal 
        options={confirm.options} 
        onConfirm={handleConfirm} 
        onCancel={handleCancel} 
      />
    </UiContext.Provider>
  );
}

export function useUi() {
  const context = useContext(UiContext);
  if (context === undefined) {
    throw new Error('useUi must be used within a UiProvider');
  }
  return context;
}
