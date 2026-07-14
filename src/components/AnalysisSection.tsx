import { LucideIcon } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface AnalysisSectionProps {
  title: string;
  icon: LucideIcon;
  data: Array<{ name: string; count: number; totalValue: number }>;
  isDarkMode: boolean;
  chartType: 'bar' | 'pie';
  colorScheme: 'default' | 'status' | 'management' | 'product';
}

export function AnalysisSection({ 
  title, 
  icon: Icon, 
  data, 
  isDarkMode, 
  chartType,
  colorScheme 
}: AnalysisSectionProps) {
  
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
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Contratos: <span className="font-bold">{payload[0].payload.count}</span>
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Valor: <span className="font-bold">{formatCurrency(payload[0].payload.totalValue)}</span>
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {payload[0].payload.totalValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
          </p>
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
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        {data.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <p className="text-sm">No hay datos disponibles con los filtros actuales</p>
          </div>
        ) : chartType === 'bar' ? (
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
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalValue" radius={[8, 8, 0, 0]}>
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Categoría
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Contratos
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Valor
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  % Total
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {data.map((item, index) => (
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
      </div>
    </div>
  );
}
