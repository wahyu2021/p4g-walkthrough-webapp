import { useMemo } from 'react';
import { getSocialLinks } from '../utils/dataFetcher';
import { SocialLinkCard } from '../components/molecules/SocialLinkCard';

export function SocialLinksPage() {
  const socialLinks = useMemo(() => getSocialLinks(), []);

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-p4-black border-l-8 border-p4-yellow p-6 mb-4">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Social Links <span className="text-p4-yellow">Directory</span>
        </h2>
        <p className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest">
          Build bonds and unlock the true power of your Persona.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialLinks.map((sl) => (
          <SocialLinkCard key={sl.id} sl={sl} />
        ))}
      </div>
    </div>
  );
}
