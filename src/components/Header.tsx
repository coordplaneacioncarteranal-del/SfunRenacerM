import { Moon, Sun } from 'lucide-react';
import { lastUpdate } from '../data/contractsData';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ isDarkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/80 border-slate-700' 
        : 'bg-white/80 border-slate-200'
    }`}>
      <div className="container mx-auto px-4 py-4 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-1 rounded-xl overflow-hidden flex items-center justify-center ${
              isDarkMode ? 'bg-white/10' : 'bg-white border shadow-sm'
            }`} style={{ width: '56px', height: '56px' }}>
              <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Logo SFUN" className="w-full h-full object-cover scale-[1.3] rounded-lg" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Dashboard SFUN
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Contratos Vigentes - Coordinación de Planeación
              </p>
              {lastUpdate && (
                <p className={`text-xs mt-0.5 font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Última actualización de datos: {new Date(lastUpdate).toLocaleString('es-CO', { 
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">En vivo</span>
            </div>
            
            <button
              onClick={onToggleDarkMode}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
