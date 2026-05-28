interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search activities...' }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md mx-auto md:mx-0 group isolate">
      {/* Background Skewed Box with Shadow and Border */}
      <div 
        className="absolute inset-0 bg-p4-black border-2 border-p4-yellow shadow-[4px_4px_0px_0px_#111111] z-0 transition-all group-focus-within:border-white group-focus-within:shadow-[6px_6px_0px_0px_#111111]"
        style={{ transform: 'skewX(-10deg)' }}
      />
      
      <div className="relative z-10 flex items-center px-4">
        <div className="mr-2">
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
            className="text-p4-yellow group-focus-within:text-white transition-colors"
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white py-3 outline-none placeholder:text-gray-600 font-bold tracking-wider italic text-sm"
        />

        {value && (
          <button 
            onClick={() => onChange('')}
            className="ml-2 text-gray-500 hover:text-p4-yellow transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
