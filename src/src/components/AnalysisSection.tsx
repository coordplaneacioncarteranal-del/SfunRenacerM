import React, { useState, useMemo } from 'react';
import { LucideIcon, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface AnalysisSectionProps {
  title: string;
  icon: LucideIcon;
  data: Array<{ name: string; count: number; totalValue: number; [key: string]: any }>;
  isDarkMode: boolean;
  chartType: 'bar' | 'pie' | 'stacked-bar';
  colorScheme: 'default' | 'status' | 'management' | 'product';
  stackedKeys?: string[];
}

export function AnalysisSection({ 
  title, 
  icon: Icon, 
  data, 
  isDarkMode, 
  chartType,
  colorScheme,
  stackedKeys
}: AnalysisSectionProps) {
  
  const [activeTab, setActiveTab] = useState<'clientes' | 'valor'>('valor');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        if (valA === undefined || valA === null) valA = 0;
        if (valB === undefined || valB === null) valB = 0;

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }

        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40 inline-block" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1 text-blue-500 inline-block" />
      : <ArrowDown className="w-3 h-3 ml-1 text-blue-500 inline-block" />;
  };

  const getColorPalette = () => {
    const palettes = {
      default: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'],
      status: ['#10b981', '#f59e0b', '#f97316', '#ef4444', '#dc2626'],
      management: ['#10b981', '#f59e0b', '#ef4444', '#06b6d4'],
      product: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
    };
    return palettes[colorScheme];
  };

  const colors = getColorPalette();

  const formatCurrency = (value: number): string => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString('es-CO')}`;
  };

  const formatFullCurrency = (value: number): string => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-4 py-3 rounded-lg border shadow-lg ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-600' 
            : 'bg-white border-slate-200'
        }`}>
          <p className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {payload[0].payload.name}
          </p>
          
          {chartType === 'stacked-bar' ? (
            <>
              {payload.map((entry: any, index: number) => (
                <p key={index} className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span style={{color: entry.color}}>{entry.name.replace('_count', '')}</span>: <span className="font-bold">{activeTab === 'clientes' ? entry.value : formatCurrency(entry.value)}</span>
                </p>
              ))}
              <div className={`mt-2 pt-2 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Total Regional: <span className="font-bold">{activeTab === 'clientes' ? payload[0].payload.count : formatCurrency(payload[0].payload.totalValue)}</span>
                </p>
              </div>
            </>
          ) : (
            <>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Contratos: <span className="font-bold">{payload[0].payload.count}</span>
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Valor: <span className="font-bold">{formatCurrency(payload[0].payload.totalValue)}</span>
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {payload[0].payload.totalValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const totalValue = data.reduce((sum, item) => sum + item.totalValue, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={`rounded-xl border backdrop-blur-sm overflow-hidden transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white/70 border-slate-200'
    }`}>
      {/* Header */}
      <div className={`p-5 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <Icon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {title}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {totalCount} contratos • {formatCurrency(totalValue)}
              </p>
            </div>
          </div>
          {chartType === 'stacked-bar' && (
            <div className="flex bg-slate-200/50 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('valor')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'valor'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Valor Total
              </button>
              <button
                onClick={() => setActiveTab('clientes')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'clientes'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Clientes / Contratos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        {data.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <p className="text-sm">No hay datos disponibles con los filtros actuales</p>
          </div>
        ) : (chartType === 'bar' || chartType === 'stacked-bar') ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isDarkMode ? '#475569' : '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isDarkMode ? '#475569' : '#cbd5e1' }}
                tickFormatter={activeTab === 'clientes' ? (val) => val : formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              {chartType === 'stacked-bar' && stackedKeys ? (
                <>
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  {stackedKeys.map((key, index) => (
                    <Bar key={key} dataKey={activeTab === 'clientes' ? `${key}_count` : key} stackId="a" fill={colors[index % colors.length]} name={key} />
                  ))}
                </>
              ) : (
                <Bar dataKey="totalValue" radius={[8, 8, 0, 0]}>
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="totalValue"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Data Table */}
      <div className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        {chartType === 'stacked-bar' && stackedKeys ? (
          <div className="flex flex-col">
            {activeTab === 'clientes' && (
              <>
                <div className={`px-4 py-3 border-b font-semibold text-sm ${isDarkMode ? 'border-slate-700 text-slate-200 bg-slate-800/50' : 'border-slate-200 text-slate-700 bg-slate-50'}`}>
                  Cantidad de Contratos por Grupo Atraso
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
                      <tr>
                        <th 
                          onClick={() => handleSort('name')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Categoría {renderSortIcon('name')}
                        </th>
                        {stackedKeys.map(k => (
                          <th 
                            key={k} 
                            onClick={() => handleSort(`${k}_count`)}
                            className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {k} {renderSortIcon(`${k}_count`)}
                          </th>
                        ))}
                        <th 
                          onClick={() => handleSort('count')}
                          className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          TOTAL {renderSortIcon('count')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                      {sortedData.map((item, index) => (
                        <tr key={index} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.name}</span>
                            </div>
                          </td>
                          {stackedKeys.map(k => (
                            <td key={k} className={`px-4 py-3 text-center text-sm whitespace-nowrap ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              {item[`${k}_count`] || 0}
                            </td>
                          ))}
                          <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {item.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className={`border-t-2 ${isDarkMode ? 'border-slate-600 bg-slate-900/50' : 'border-slate-300 bg-slate-50'}`}>
                      <tr>
                        <td className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>TOTAL</td>
                        {stackedKeys.map(k => {
                          const colTotal = data.reduce((sum, item) => sum + (item[`${k}_count`] || 0), 0);
                          return (
                            <td key={k} className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {colTotal}
                            </td>
                          );
                        })}
                        <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalCount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'valor' && (
              <>
                {/* Tabla 2: Valor Total e Indicadores Financieros */}
                <div className={`px-4 py-3 border-b font-semibold text-sm ${isDarkMode ? 'border-slate-700 text-slate-200 bg-slate-800/50' : 'border-slate-200 text-slate-700 bg-slate-50'}`}>
                  Valor Total y Metas Financieras por Regional
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
                  <tr>
                    <th 
                      onClick={() => handleSort('name')}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Categoría {renderSortIcon('name')}
                    </th>
                    {stackedKeys.map(k => (
                      <th 
                        key={k} 
                        onClick={() => handleSort(k)}
                        className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {k} {renderSortIcon(k)}
                      </th>
                    ))}
                    <th 
                      onClick={() => handleSort('totalValue')}
                      className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      CARTERA TOTAL {renderSortIcon('totalValue')}
                    </th>
                    <th 
                      onClick={() => handleSort('presupuesto')}
                      className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 text-blue-500`}>
                      PRESUPUESTO {renderSortIcon('presupuesto')}
                    </th>
                    <th 
                      onClick={() => handleSort('recaudo')}
                      className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 text-green-500`}>
                      RECAUDO {renderSortIcon('recaudo')}
                    </th>
                    <th 
                      onClick={() => handleSort('faltante')}
                      className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 text-red-500`}>
                      FALTANTE ($) {renderSortIcon('faltante')}
                    </th>
                    <th 
                      onClick={() => handleSort('cumplimiento')}
                      className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 text-teal-500`}>
                      % CUMPL. {renderSortIcon('cumplimiento')}
                    </th>
                    <th 
                      onClick={() => handleSort('proyeccionCumplimiento')}
                      className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-200/50 text-indigo-500`}>
                      PROY. CUMPL. {renderSortIcon('proyeccionCumplimiento')}
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                  {sortedData.map((item, index) => (
                    <tr key={index} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.name}</span>
                        </div>
                      </td>
                      {stackedKeys.map(k => (
                        <td key={k} className={`px-4 py-3 text-center text-sm whitespace-nowrap ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {item[k] ? formatFullCurrency(item[k]) : '-'}
                        </td>
                      ))}
                      <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {formatFullCurrency(item.totalValue)}
                      </td>
                      <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {item.presupuesto !== undefined ? formatFullCurrency(item.presupuesto) : '-'}
                      </td>
                      <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {item.recaudo !== undefined ? formatFullCurrency(item.recaudo) : '-'}
                      </td>
                      <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        {item.faltante !== undefined ? formatFullCurrency(item.faltante) : '-'}
                      </td>
                      <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                        {item.cumplimiento !== undefined ? `${(item.cumplimiento * 100).toFixed(1)}%` : '-'}
                      </td>
                      <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {item.proyeccionCumplimiento !== undefined ? `${(item.proyeccionCumplimiento * 100).toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={`border-t-2 ${isDarkMode ? 'border-slate-600 bg-slate-900/50' : 'border-slate-300 bg-slate-50'}`}>
                  <tr>
                    <td className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>TOTAL</td>
                    {stackedKeys.map(k => {
                      const colTotal = data.reduce((sum, item) => sum + (item[k] || 0), 0);
                      return (
                        <td key={k} className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {colTotal ? formatFullCurrency(colTotal) : '-'}
                        </td>
                      );
                    })}
                    <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatFullCurrency(totalValue)}</td>
                    <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {formatFullCurrency(data.reduce((sum, item) => sum + (item.presupuesto || 0), 0))}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {formatFullCurrency(data.reduce((sum, item) => sum + (item.recaudo || 0), 0))}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {formatFullCurrency(data.reduce((sum, item) => sum + (item.faltante || 0), 0))}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                      {data.reduce((sum, item) => sum + (item.presupuesto || 0), 0) > 0 
                        ? `${((data.reduce((sum, item) => sum + (item.recaudo || 0), 0) / data.reduce((sum, item) => sum + (item.presupuesto || 0), 0)) * 100).toFixed(1)}%` 
                        : '-'}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-bold whitespace-nowrap ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {(() => {
                        const totalPresupuesto = data.reduce((sum, item) => sum + (item.presupuesto || 0), 0);
                        const totalRecaudo = data.reduce((sum, item) => sum + (item.recaudo || 0), 0);
                        const today = new Date();
                        const diasTranscurridos = Math.max(1, today.getDate() - 1);
                        const diasTotalesMes = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                        const totalProyRecaudo = (totalRecaudo / diasTranscurridos) * diasTotalesMes;
                        return totalPresupuesto > 0 
                          ? `${((totalProyRecaudo / totalPresupuesto) * 100).toFixed(1)}%` 
                          : '-';
                      })()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Categoría {renderSortIcon('name')}
                  </th>
                  <th 
                    onClick={() => handleSort('count')}
                    className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Contratos {renderSortIcon('count')}
                  </th>
                  <th 
                    onClick={() => handleSort('totalValue')}
                    className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Valor {renderSortIcon('totalValue')}
                  </th>
                  <th 
                    onClick={() => handleSort('totalValue')}
                    className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    % Total {renderSortIcon('totalValue')}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {sortedData.map((item, index) => (
                  <tr 
                    key={index}
                    className={`transition-colors ${
                      isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-slate-200' : 'text-slate-900'
                        }`}>
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-semibold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-900'
                    }`}>
                      {item.count}
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-semibold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-900'
                    }`}>
                      {formatCurrency(item.totalValue)}
                    </td>
                    <td className={`px-4 py-3 text-right text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {((item.totalValue / totalValue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className={`border-t-2 ${
                isDarkMode ? 'border-slate-600 bg-slate-900/50' : 'border-slate-300 bg-slate-50'
              }`}>
                <tr>
                  <td className={`px-4 py-3 text-sm font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    TOTAL
                  </td>
                  <td className={`px-4 py-3 text-right text-sm font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {totalCount}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {formatCurrency(totalValue)}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    100%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
