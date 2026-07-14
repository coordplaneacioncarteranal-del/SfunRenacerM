import { TrendingUp, TrendingDown, FileText, CheckCircle, DollarSign, AlertTriangle } from 'lucide-react';

interface MetricsGridProps {
  metrics: {
    totalContracts: number;
    activeContracts: number;
    totalValue: number;
    overdueContracts: number;
    overdueValue: number;
    activeRate: number;
    overdueRate: number;
  };
  isDarkMode: boolean;
}

export function MetricsGrid({ metrics, isDarkMode }: MetricsGridProps) {
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

  const metricCards = [
    {
      title: 'Total Contratos',
      value: metrics.totalContracts.toLocaleString('es-CO'),
      subtitle: 'Cartera completa',
      icon: FileText,
      color: 'blue',
      trend: null,
    },
    {
      title: 'Contratos Activos',
      value: metrics.activeContracts.toLocaleString('es-CO'),
      subtitle: `${metrics.activeRate.toFixed(1)}% del total`,
      icon: CheckCircle,
      color: 'green',
      trend: metrics.activeRate >= 80 ? 'up' : 'down',
    },
    {
      title: 'Valor Total Cartera',
      value: formatCurrency(metrics.totalValue),
      subtitle: metrics.totalValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }),
      icon: DollarSign,
      color: 'purple',
      trend: 'up',
    },
    {
      title: 'Contratos Vencidos',
      value: metrics.overdueContracts.toLocaleString('es-CO'),
      subtitle: `${metrics.overdueRate.toFixed(1)}% del total`,
      icon: AlertTriangle,
      color: 'red',
      trend: metrics.overdueRate > 0 ? 'down' : null,
    },
    {
      title: 'Valor en Mora',
      value: formatCurrency(metrics.overdueValue),
      subtitle: metrics.overdueValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }),
      icon: TrendingDown,
      color: 'orange',
      trend: 'down',
    },
    {
      title: 'Tasa de Cumplimiento',
      value: `${(100 - metrics.overdueRate).toFixed(1)}%`,
      subtitle: 'Contratos al día',
      icon: TrendingUp,
      color: 'teal',
      trend: (100 - metrics.overdueRate) >= 80 ? 'up' : 'down',
    },
  ];

  const getColorClasses = (color: string, isDark: boolean) => {
    const colors = {
      blue: isDark ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'from-blue-50 to-blue-100 border-blue-200',
      green: isDark ? 'from-green-500/20 to-green-600/20 border-green-500/30' : 'from-green-50 to-green-100 border-green-200',
      purple: isDark ? 'from-purple-500/20 to-purple-600/20 border-purple-500/30' : 'from-purple-50 to-purple-100 border-purple-200',
      red: isDark ? 'from-red-500/20 to-red-600/20 border-red-500/30' : 'from-red-50 to-red-100 border-red-200',
      orange: isDark ? 'from-orange-500/20 to-orange-600/20 border-orange-500/30' : 'from-orange-50 to-orange-100 border-orange-200',
      teal: isDark ? 'from-teal-500/20 to-teal-600/20 border-teal-500/30' : 'from-teal-50 to-teal-100 border-teal-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string, isDark: boolean) => {
    const colors = {
      blue: isDark ? 'text-blue-400' : 'text-blue-600',
      green: isDark ? 'text-green-400' : 'text-green-600',
      purple: isDark ? 'text-purple-400' : 'text-purple-600',
      red: isDark ? 'text-red-400' : 'text-red-600',
      orange: isDark ? 'text-orange-400' : 'text-orange-600',
      teal: isDark ? 'text-teal-400' : 'text-teal-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
      {metricCards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            getColorClasses(card.color, isDarkMode)
          }`}
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${
                isDarkMode ? 'bg-slate-900/50' : 'bg-white/80'
              }`}>
                <card.icon className={`w-5 h-5 ${getIconColorClasses(card.color, isDarkMode)}`} />
              </div>
              {card.trend && (
                <div className={`flex items-center gap-1 ${
                  card.trend === 'up' 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {card.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className={`text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {card.value}
              </p>
              <p className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {card.subtitle}
              </p>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20 ${
            isDarkMode ? 'bg-white' : 'bg-slate-900'
          }`}></div>
        </div>
      ))}
    </div>
  );
}
