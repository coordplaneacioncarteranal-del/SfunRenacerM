import React from 'react';
import { Contract } from '../data/contractsData';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertsSectionProps {
  data: Contract[];
  isDarkMode: boolean;
}

interface RegionalStats {
  regional: string;
  totalValue: number;
  count: number;
}

export function AlertsSection({ data, isDarkMode }: AlertsSectionProps) {
  const preventivaKeys = ['ATRASO DE 11 A 25', 'ATRASO DE 26 A 50'];
  const preocupanteKeys = ['ATRASO DE 51 A 60', 'ATRASO DE 61 A 90'];
  const criticaKeys = ['ATRASO MAYOR A 90'];

  const processCell = (tipoName: string, atrasoKeys: string[]): RegionalStats[] => {
    // Some types might have slightly different casing/spacing, so we do a loose match
    const filtered = data.filter(c => 
      c.tipo && c.tipo.toUpperCase().includes(tipoName) && 
      atrasoKeys.includes(c.grupoAtraso)
    );
    
    const regionalMap: Record<string, { totalValue: number; count: number }> = {};
    filtered.forEach(c => {
      const reg = c.regional || 'SIN REGIONAL';
      if (!regionalMap[reg]) {
        regionalMap[reg] = { totalValue: 0, count: 0 };
      }
      regionalMap[reg].totalValue += c.valorTotalContrato;
      regionalMap[reg].count += 1;
    });

    return Object.entries(regionalMap)
      .map(([regional, stats]) => ({ regional, ...stats }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 3);
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const renderCard = (title: string, statsData: RegionalStats[], colorScheme: 'yellow' | 'orange' | 'red') => {
    let containerClass = '';
    let headerTextClass = '';
    let Icon = Info;
    
    if (colorScheme === 'yellow') {
      containerClass = isDarkMode ? 'bg-yellow-900/20 border-yellow-800/50' : 'bg-[#fff9c4] border-[#fff59d]';
      headerTextClass = isDarkMode ? 'text-yellow-400' : 'text-yellow-800';
      Icon = Info;
    } else if (colorScheme === 'orange') {
      containerClass = isDarkMode ? 'bg-orange-900/20 border-orange-800/50' : 'bg-[#ffe0b2] border-[#ffcc80]';
      headerTextClass = isDarkMode ? 'text-orange-400' : 'text-orange-800';
      Icon = AlertTriangle;
    } else {
      containerClass = isDarkMode ? 'bg-red-900/20 border-red-800/50' : 'bg-[#ffcdd2] border-[#ef9a9a]';
      headerTextClass = isDarkMode ? 'text-red-400' : 'text-red-800';
      Icon = AlertCircle;
    }

    return (
      <div className={`p-4 rounded-xl border ${containerClass} transition-colors duration-300 shadow-sm h-full`}>
        <div className={`flex items-center gap-2 mb-4 font-bold text-sm ${headerTextClass}`}>
          <Icon size={16} />
          {title}
        </div>
        
        {statsData.length === 0 ? (
          <div className={`text-sm italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} py-4 text-center`}>
            Sin datos en este rango
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {statsData.map((stat, index) => (
              <div key={stat.regional} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full ${
                    isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white/60 text-slate-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {stat.regional}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    {formatCurrency(stat.totalValue)}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {stat.count.toLocaleString('es-CO')} clientes
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const canales = [
    { title: 'MEDIOS', key: 'MEDIOS' },
    { title: 'OFICINA', key: 'OFICINA' },
    { title: 'ASESOR COBRANZA', key: 'ASESOR DE COBRANZA' }
  ];

  return (
    <div className={`p-6 rounded-xl border backdrop-blur-sm transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white/70 border-slate-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Semaforizacion de Alertas
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Top 3 Regionales a atacar por nivel de atraso y canal de cobro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {canales.map((canal) => (
          <div key={canal.key} className="flex flex-col gap-4">
            <h3 className={`text-center font-bold tracking-wider text-sm ${
              isDarkMode ? 'text-slate-300 bg-slate-700/50' : 'text-slate-600 bg-slate-100'
            } py-2 rounded-lg border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
              {canal.title}
            </h3>
            
            {renderCard(
              "PREVENTIVA (11-50)", 
              processCell(canal.key, preventivaKeys), 
              "yellow"
            )}
            
            {renderCard(
              "PREOCUPANTE (51-90)", 
              processCell(canal.key, preocupanteKeys), 
              "orange"
            )}
            
            {renderCard(
              "CRITICA (>90)", 
              processCell(canal.key, criticaKeys), 
              "red"
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
