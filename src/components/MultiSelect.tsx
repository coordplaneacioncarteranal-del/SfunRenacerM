import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  isDarkMode: boolean;
}

export function MultiSelect({ label, options, selected, onChange, isDarkMode }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const displayText = selected.length === 0 
    ? 'Todos' 
    : selected.length === 1 
    ? selected[0]
    : `${selected.length} seleccionados`;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className={`block text-sm font-medium mb-2 ${
        isDarkMode ? 'text-slate-300' : 'text-slate-700'
      }`}>
        {label}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-lg border flex items-center justify-between transition-all duration-200 ${
          isDarkMode 
            ? 'bg-slate-900/50 border-slate-600 text-slate-200 hover:border-blue-500' 
            : 'bg-white border-slate-300 text-slate-700 hover:border-blue-500'
        } ${selected.length > 0 ? (isDarkMode ? 'border-blue-500' : 'border-blue-500') : ''}`}
      >
        <span className={`text-sm truncate ${selected.length > 0 ? 'font-medium' : ''}`}>
          {displayText}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ml-2 flex-shrink-0 ${
          isOpen ? 'rotate-180' : ''
        } ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-2 w-full rounded-lg border shadow-xl max-h-60 overflow-y-auto ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-600' 
            : 'bg-white border-slate-200'
        }`}>
          {options.map(option => (
            <button
              key={option}
              onClick={() => handleToggle(option)}
              className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150 ${
                isDarkMode 
                  ? 'hover:bg-slate-700 text-slate-200' 
                  : 'hover:bg-slate-50 text-slate-700'
              } ${selected.includes(option) ? (isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50') : ''}`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                selected.includes(option)
                  ? 'bg-blue-500 border-blue-500'
                  : isDarkMode 
                  ? 'border-slate-600' 
                  : 'border-slate-300'
              }`}>
                {selected.includes(option) && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-sm text-left">{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
