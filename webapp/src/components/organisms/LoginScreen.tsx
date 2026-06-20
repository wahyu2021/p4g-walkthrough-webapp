import { useState, useRef, useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export function LoginScreen() {
  const { login } = useProgress();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const bodyPayload = mode === 'login' 
        ? { username, password } 
        : { username, password, inviteCode };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan sistem.');
      }

      if (mode === 'login') {
        // Eksekusi Context Login (menyimpan userId, token, dan role)
        login(data.user.id, data.token, data.user.role);
      } else {
        // Jika sukses register, arahkan otomatis ke mode login
        setMode('login');
        setPassword('');
        setInviteCode('');
        alert('Registrasi sukses! Silakan masuk dengan kata sandi barumu.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-p4-black relative" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
      <div className="absolute inset-0 bg-p4-black/60" />
      
      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 w-full max-w-md px-6">
        <h1 className="text-4xl md:text-5xl font-black text-p4-yellow uppercase tracking-[0.2em] mb-2 skew-x-[-5deg] drop-shadow-[4px_4px_0_#111] text-center">
          {mode === 'login' ? 'System Login' : 'New Identity'}
        </h1>
        <p className="text-p4-gray text-xs md:text-sm font-bold tracking-widest uppercase mb-12 bg-p4-yellow px-4 py-1 skew-x-[-10deg]">
          {mode === 'login' ? 'Enter your credentials' : 'Register with invite ticket'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col w-full animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-[#2a2a2a] p-6 border-l-4 border-p4-yellow shadow-[6px_6px_0_0_#000] skew-x-[-3deg] relative flex flex-col gap-4">
            
            <div className="flex flex-col skew-x-[3deg]">
              <label className="text-p4-yellow text-xs font-black tracking-widest uppercase mb-1">Character Name</label>
              <input
                ref={inputRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-p4-black text-white px-3 py-2 font-bold border-2 border-p4-gray focus:outline-none focus:border-p4-yellow transition-colors"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex flex-col skew-x-[3deg]">
              <label className="text-p4-yellow text-xs font-black tracking-widest uppercase mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-p4-black text-white px-3 py-2 font-bold border-2 border-p4-gray focus:outline-none focus:border-p4-yellow transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {mode === 'register' && (
              <div className="flex flex-col skew-x-[3deg] animate-in fade-in slide-in-from-top-2">
                <label className="text-p4-yellow text-xs font-black tracking-widest uppercase mb-1">Invite Ticket</label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="bg-p4-black text-white px-3 py-2 font-bold border-2 border-p4-yellow focus:outline-none focus:border-white uppercase transition-colors"
                  placeholder="P4G-XXXXX"
                  required
                />
              </div>
            )}

            {errorMsg && (
              <p className="text-red-500 text-[11px] font-bold uppercase tracking-widest skew-x-[3deg] bg-red-950/50 p-2 border border-red-500">
                {errorMsg}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-p4-yellow hover:bg-white text-p4-black px-4 py-3 font-black text-lg skew-x-[3deg] transition-colors border-2 border-p4-black disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : (mode === 'login' ? 'ACCESS SYSTEM' : 'REGISTER')}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrorMsg('');
              }}
              className="text-p4-gray hover:text-white text-[10px] font-bold uppercase tracking-widest skew-x-[3deg] transition-colors mt-2 underline text-center cursor-pointer"
            >
              {mode === 'login' ? 'No account? Use Invite Ticket' : 'Already have account? Login'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
