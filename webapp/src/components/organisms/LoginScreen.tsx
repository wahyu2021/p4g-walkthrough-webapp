import { useState, useRef, useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';

// Anda dapat menambah daftar user (slot) di sini
const ALLOWED_USERS = ['Yuu'];
const ENV_PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD || '';

export function LoginScreen() {
  const { login } = useProgress();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  const handleSelectSlot = (user: string) => {
    if (!ENV_PASSWORD) {
      // Jika tidak ada password dikonfigurasi, langsung login
      login(user);
      return;
    }
    setSelectedUser(user);
    setPassword('');
    setError(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ENV_PASSWORD) {
      if (selectedUser) login(selectedUser);
    } else {
      setError(true);
      setPassword('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-p4-black relative" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
      <div className="absolute inset-0 bg-p4-black/60" />
      
      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <h1 className="text-4xl md:text-6xl font-black text-p4-yellow uppercase tracking-[0.2em] mb-2 skew-x-[-5deg] drop-shadow-[4px_4px_0_#111]">
          Select Save Data
        </h1>
        <p className="text-p4-gray text-sm md:text-base font-bold tracking-widest uppercase mb-12 bg-p4-yellow px-4 py-1 skew-x-[-10deg]">
          Please choose your profile
        </p>

        <div className="flex flex-col gap-6 w-full max-w-md px-6">
          {!selectedUser ? (
            ALLOWED_USERS.map((user, idx) => (
              <button
                key={user}
                onClick={() => handleSelectSlot(user)}
                className="group relative flex items-center justify-between bg-p4-gray border-2 border-p4-yellow p-4 skew-x-[-3deg] hover:-translate-y-1 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-p4-yellow transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                
                <div className="relative z-10 flex flex-col items-start skew-x-[3deg]">
                  <span className="text-[10px] text-p4-yellow group-hover:text-p4-black font-black tracking-widest uppercase mb-1 transition-colors">
                    Slot 0{idx + 1}
                  </span>
                  <span className="text-2xl text-white group-hover:text-p4-black font-black tracking-wider transition-colors drop-shadow-sm">
                    {user}
                  </span>
                </div>

                <div className="relative z-10 text-p4-yellow group-hover:text-p4-black opacity-50 group-hover:opacity-100 transition-all skew-x-[3deg]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            ))
          ) : (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col animate-in slide-in-from-right-8 duration-500">
              <div className="bg-[#2a2a2a] p-4 border-l-4 border-p4-yellow shadow-[4px_4px_0_0_#000] skew-x-[-3deg] relative">
                <button 
                  type="button"
                  onClick={() => setSelectedUser(null)} 
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 text-white font-bold border-2 border-p4-black hover:bg-white hover:text-red-600 flex items-center justify-center transition-colors shadow-sm"
                >
                  <span className="skew-x-[3deg]">×</span>
                </button>
                <label className="block text-p4-yellow text-xs font-black tracking-widest uppercase mb-3 skew-x-[3deg]">
                  Enter Access Code for {selectedUser}
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`flex-1 bg-p4-black text-white px-4 py-2 text-xl font-bold border-2 ${error ? 'border-red-500 animate-bounce' : 'border-p4-gray'} focus:outline-none focus:border-p4-yellow tracking-widest skew-x-[3deg] transition-colors`}
                    placeholder="••••••••"
                  />
                  <button type="submit" className="bg-p4-yellow hover:bg-white text-p4-black px-4 font-black skew-x-[3deg] transition-colors border-2 border-p4-black">
                    OK
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 skew-x-[3deg]">
                    Access Denied. Incorrect Password.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
