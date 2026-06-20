import { AlertTriangle } from 'lucide-react';

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
};

type ConfirmModalProps = {
  options: ConfirmOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({ options, onConfirm, onCancel }: ConfirmModalProps) {
  if (!options) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel}>
        {/* Efek Garis TV (Scanline) khusus untuk backdrop modal */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
      </div>

      {/* Modal Box */}
      <div className="relative animate-in zoom-in-95 fade-in duration-200 skew-x-[-1deg]">
        <div className="bg-[#111] border-4 border-p4-yellow p-6 md:p-8 max-w-md w-full shadow-[12px_12px_0_0_#000]">
          
          <div className="flex items-start gap-4">
            <div className={`shrink-0 p-3 shadow-[4px_4px_0_0_#000] ${options.isDestructive ? 'bg-red-600 text-white' : 'bg-p4-yellow text-p4-black'}`}>
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="flex-1">
              <h2 className={`text-xl font-black uppercase tracking-widest drop-shadow-[2px_2px_0_#000] mb-2 ${options.isDestructive ? 'text-red-500' : 'text-p4-yellow'}`}>
                {options.title || 'Peringatan'}
              </h2>
              <p className="text-gray-300 font-bold text-sm tracking-wide leading-relaxed">
                {options.message}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse md:flex-row justify-end gap-4">
            <button 
              onClick={onCancel}
              className="px-6 py-3 font-black uppercase tracking-widest text-xs border-2 border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors skew-x-[-2deg]"
            >
              {options.cancelText || 'Batal'}
            </button>
            <button 
              onClick={onConfirm}
              className={`px-6 py-3 font-black uppercase tracking-widest text-xs border-2 shadow-[4px_4px_0_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all skew-x-[-2deg] ${options.isDestructive ? 'bg-red-600 border-red-800 text-white hover:bg-red-500' : 'bg-p4-yellow border-yellow-600 text-p4-black hover:bg-yellow-300'}`}
            >
              {options.confirmText || 'Konfirmasi'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
