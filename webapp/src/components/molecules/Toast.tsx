import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastProps = {
  message: string;
  type: ToastType;
  visible: boolean;
  onClose: () => void;
};

export function Toast({ message, type, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000); // Hilang dalam 4 detik
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const getStyle = () => {
    switch (type) {
      case 'success': return 'bg-p4-yellow text-p4-black border-p4-black';
      case 'error': return 'bg-red-600 text-white border-white';
      case 'warning': return 'bg-orange-500 text-white border-white';
      case 'info': return 'bg-blue-600 text-white border-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-in slide-in-from-right-8 fade-in duration-300">
      <div className={`flex items-center gap-3 p-4 pr-12 border-4 shadow-[8px_8px_0_0_#000] skew-x-[-2deg] ${getStyle()}`}>
        <div className="shrink-0">{getIcon()}</div>
        <div className="font-bold uppercase tracking-widest text-sm drop-shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
          {message}
        </div>
        <button 
          onClick={onClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
