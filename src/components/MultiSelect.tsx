import { useState, useRef, useEffect, useMemo } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  isDarkMode: boolean;
}

export function MultiSelect({ label, options, selected, onChange, isDarkMode }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setSearchTerm('');
  };

  const filteredOptions = useMemo(() => {
    return options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

  const displayText = selected.length === 0 
    ? 'Todos' 
    : selected.length === 1 
    ? selected[0]
    : `${selected.length} seleccionados`;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className={`block text-sm font-medium mb-2 flex justify-between items-center ${
        isDarkMode ? 'text-slate-300' : 'text-slate-700'
      }`}>
        {label}
        {selected.length > 0 && (
          <button 
            onClick={handleClear}
            className={`text-xs flex items-center gap-1 hover:underline ${
              isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'
            }`}
          >
            <X size={12} />
            Limpiar
          </button>
        )}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-lg border flex items-center justify-between transition-all duration-200 ${
          isDarkMode 
            ? 'bg-slate-900/50 border-slate-600 text-slate-200 hover:border-blue-500' 
            : 'bg-white border-slate-300 text-slate-700 hover:border-blue-500'
        } ${selected.length > 0 ? (isDarkMode ? 'border-blue-500' : 'border-blue-500') : ''}`}
      >
        <span className={`text-sm truncate pr-2 ${selected.length > 0 ? 'font-medium' : ''}`}>
          {displayText}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
        </div>
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-2 w-full rounded-lg border shadow-xl flex flex-col ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-600' 
            : 'bg-white border-slate-200'
        }`}>
          {/* Barra de búsqueda */}
          <div className={`p-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className={`flex items-center px-3 py-1.5 rounded-md border ${
              isDarkMode ? 'bg-slate-900/50 border-slate-600 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-700'
            }`}>
              <Search className="w-4 h-4 mr-2 opacity-50" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-center opacity-50">
                No hay resultados
              </div>
            ) : (
              filteredOptions.map(option => (
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
                  <span className="text-sm text-left truncate">{option}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
