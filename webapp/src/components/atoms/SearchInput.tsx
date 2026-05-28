interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search activities...' }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md mx-auto md:mx-0">
      <div 
        className="absolute inset-0 bg-p4-black border-2 border-p4-yellow -z-10"
        style={{ transform: 'skewX(-10deg)' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-white px-6 py-2 outline-none placeholder:text-gray-500 font-bold tracking-wide italic"
        style={{ transform: 'skewX(0deg)' }}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-p4-yellow"
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </div>
    </div>
  );
}
