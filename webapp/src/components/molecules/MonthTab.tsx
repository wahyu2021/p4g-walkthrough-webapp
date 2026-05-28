interface MonthTabProps {
  monthName: string;
  isActive: boolean;
  onClick: () => void;
}

export function MonthTab({ monthName, isActive, onClick }: MonthTabProps) {
  // Capitalize first letter
  const displayName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <button
      onClick={onClick}
      className={`
        w-full px-6 py-3 font-bold text-lg border-2 border-p4-black transition-all whitespace-nowrap
        ${isActive 
          ? 'bg-p4-yellow text-p4-black shadow-none translate-y-1' 
          : 'bg-p4-gray text-p4-yellow shadow-[4px_4px_0px_0px_#111111] hover:-translate-y-0.5 hover:bg-[#444]'}
      `}
      style={{
        transform: isActive ? 'skewX(-5deg)' : 'skewX(-5deg) translateY(-2px)',
      }}
    >
      <span className="block" style={{ transform: 'skewX(5deg)' }}>
        {displayName}
      </span>
    </button>
  );
}
