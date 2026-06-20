import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-p4-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        {/* Giant 404 Header */}
        <div className="text-9xl font-black text-p4-yellow mb-4 drop-shadow-[4px_4px_0_#000] skew-x-[-10deg]">
          404
        </div>
        
        {/* Decorative TV Line */}
        <div className="w-full h-2 bg-p4-yellow skew-x-[-15deg] mb-8 relative">
          <div className="absolute inset-0 bg-white animate-pulse mix-blend-overlay"></div>
        </div>
        
        {/* Message */}
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest mb-6 skew-x-[-5deg]">
          Sinyal Terputus
        </h1>
        <p className="text-gray-400 font-bold text-lg max-w-md mx-auto mb-10 border-l-4 border-p4-yellow pl-4 text-left">
          Distorsi kabut terlalu pekat. Area yang kamu cari tidak dapat ditemukan di dalam TV World atau telah dihapus dari realita.
        </p>
        
        {/* Action Button */}
        <Link 
          to="/" 
          className="group relative px-8 py-4 bg-p4-yellow text-p4-black font-black uppercase tracking-[0.3em] skew-x-[-10deg] hover:bg-white transition-colors flex items-center gap-3"
        >
          <AlertTriangle className="w-6 h-6 animate-pulse" />
          <span>Kembali ke Junes</span>
          
          <div className="absolute -inset-1 border-2 border-p4-yellow opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all skew-x-[10deg]"></div>
        </Link>
      </div>
    </div>
  );
}
