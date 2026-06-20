import { useState, useEffect } from 'react';
import { Megaphone, Send } from 'lucide-react';

export function AdminAnnouncements({ token, baseUrl }: { token: string; baseUrl: string }) {
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState<'info' | 'warning'>('info');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${baseUrl}/announcement`)
      .then(r => r.json())
      .then(d => {
        setMessage(d.message || '');
        setIsActive(d.isActive || false);
        setType(d.type || 'info');
      }).catch(e => console.error(e));
  }, [baseUrl]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/admin/announcement`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, isActive, type })
      });
      if (res.ok) alert('Pengumuman berhasil disiarkan!');
    } catch (e) {
      alert('Gagal menyiarkan.');
    }
    setLoading(false);
  };

  return (
    <div className="skew-x-[2deg]">
      <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 border-b-2 border-p4-yellow/30 pb-6 mb-8">
        <Megaphone className="w-5 h-5 text-p4-yellow" />
        Sistem Siaran Pengumuman (Megaphone)
      </h2>
      <div className="bg-[#111] p-6 border-l-4 border-p4-yellow">
        <div className="mb-4">
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Pesan Siaran</label>
          <textarea 
            value={message} onChange={e => setMessage(e.target.value)}
            className="w-full bg-[#222] border-2 border-gray-600 text-white p-4 focus:border-p4-yellow focus:outline-none min-h-[100px]"
            placeholder="Ketik pengumuman di sini..."
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-p4-yellow" />
            <span className="text-sm font-bold uppercase tracking-widest">Aktifkan Siaran</span>
          </label>
          <select value={type} onChange={e => setType(e.target.value as any)} className="bg-[#222] text-white border-2 border-gray-600 p-2 text-xs uppercase font-bold outline-none focus:border-p4-yellow">
            <option value="info">INFO BIASA (KUNING)</option>
            <option value="warning">PERINGATAN (MERAH)</option>
          </select>
        </div>
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-p4-yellow text-p4-black px-6 py-2 font-black uppercase tracking-widest hover:bg-white transition-colors">
          <Send className="w-4 h-4" /> {loading ? 'Menyimpan...' : 'Siarkan ke Seluruh Pemain'}
        </button>
      </div>
    </div>
  );
}
