import { NavLink } from 'react-router-dom';

interface NavTabsProps {
  isVertical?: boolean;
}

export function NavTabs({ isVertical = false }: NavTabsProps) {
  const tabs = [
    { id: '/', label: 'Walkthrough' },
    { id: '/social-links', label: 'Social Links' },
    { id: '/dungeons', label: 'Dungeons' },
    { id: '/exams', label: 'Exams' },
    { id: '/tracker', label: 'Tracker' },
    { id: '/velvet-room', label: 'Velvet Room' },
  ];

  return (
    <nav className={`flex ${isVertical ? 'flex-col space-y-4 px-2' : 'space-x-1 md:space-x-4 overflow-x-auto no-scrollbar py-2'}`}>
      {tabs.map((tab) => {
        return (
          <NavLink
            key={tab.id}
            to={tab.id}
            className={({ isActive }) => `
              px-3 md:px-6 py-2 text-[10px] md:text-xs font-black uppercase tracking-tighter md:tracking-widest transition-all border-2 whitespace-nowrap inline-block text-center
              ${isVertical ? 'w-full text-left' : ''}
              ${isActive 
                ? 'bg-p4-yellow text-p4-black border-p4-black shadow-[2px_2px_0px_0px_#000]' 
                : 'bg-p4-black text-gray-400 border-p4-gray hover:text-p4-yellow hover:border-p4-yellow'}
            `}
            style={{
              transform: 'skewX(-15deg)',
            }}
          >
            <div style={{ transform: 'skewX(15deg)' }}>
              {tab.label}
            </div>
          </NavLink>
        );
      })}
    </nav>
  );
}
