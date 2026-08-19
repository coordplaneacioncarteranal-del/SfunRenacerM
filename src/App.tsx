import { useState, useMemo } from 'react';
import { contractsData, budgetData } from './data/contractsData';
import { FilterPanel } from './components/FilterPanel';
import { MetricsGrid } from './components/MetricsGrid';
import { AnalysisSection } from './components/AnalysisSection';
import { MapSection } from './components/MapSection';
import { AlertsSection } from './components/AlertsSection';
import { Header } from './components/Header';
import { BarChart3, TrendingUp, AlertCircle, DollarSign, MapPin } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Estados de filtros
  const [selectedProductoProvision, setSelectedProductoProvision] = useState<string[]>([]);
  const [selectedEstadoVenta, setSelectedEstadoVenta] = useState<string[]>(['Aprobado', 'Aprobado Sc']);
  const [selectedEstadoProvision, setSelectedEstadoProvision] = useState<string[]>(['Activo', 'Atrasado']);
  const [selectedProducto, setSelectedProducto] = useState<string[]>(['Renacer Mascotas']);
  const [selectedTipo, setSelectedTipo] = useState<string[]>([]);
  const [selectedRegional, setSelectedRegional] = useState<string[]>([]);
  const [selectedGrupoAtraso, setSelectedGrupoAtraso] = useState<string[]>([]);
  const [selectedGestion, setSelectedGestion] = useState<string[]>([]);
  const [selectedGrupoCobro, setSelectedGrupoCobro] = useState<string[]>([]);

  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState<'analisis' | 'alertas' | 'mapa'>('analisis');

  // Extraer valores únicos para los filtros
  const filterOptions = useMemo(() => ({
    productoProvision: Array.from(new Set(contractsData.map(c => c.productoProvision))).filter(Boolean).sort(),
    estadoVenta: Array.from(new Set(contractsData.map(c => c.estadoVenta))).filter(Boolean).sort(),
    estadoProvision: Array.from(new Set(contractsData.map(c => c.estadoProvision))).filter(Boolean).sort(),
    producto: Array.from(new Set(contractsData.map(c => c.producto))).filter(Boolean).sort(),
    tipo: Array.from(new Set(contractsData.map(c => c.tipo))).filter(Boolean).sort(),
    regional: Array.from(new Set(contractsData.map(c => (c as any).regional))).filter(Boolean).sort(),
    grupoAtraso: Array.from(new Set(contractsData.map(c => c.grupoAtraso))).filter(Boolean).sort(),
    gestion: Array.from(new Set(contractsData.map(c => (c as any).gestion))).filter(Boolean).sort(),
    grupoCobro: Array.from(new Set(contractsData.map(c => (c as any).grupoCobro))).filter(Boolean).sort(),
  }), []);

  // Filtrar datos según selección
  const filteredData = useMemo(() => {
    return contractsData.filter(contract => {
      const matchProductoProvision = selectedProductoProvision.length === 0 || 
        selectedProductoProvision.includes(contract.productoProvision);
      const matchEstadoVenta = selectedEstadoVenta.length === 0 || 
        selectedEstadoVenta.includes(contract.estadoVenta);
      const matchEstadoProvision = selectedEstadoProvision.length === 0 || 
        selectedEstadoProvision.includes(contract.estadoProvision);
      const matchProducto = selectedProducto.length === 0 || 
        selectedProducto.includes(contract.producto);
      const matchTipo = selectedTipo.length === 0 || 
        selectedTipo.includes(contract.tipo);
      const matchRegional = selectedRegional.length === 0 || 
        selectedRegional.includes((contract as any).regional);
      const matchGrupoAtraso = selectedGrupoAtraso.length === 0 || 
        selectedGrupoAtraso.includes(contract.grupoAtraso);
      const matchGestion = selectedGestion.length === 0 || 
        selectedGestion.includes((contract as any).gestion);
      const matchGrupoCobro = selectedGrupoCobro.length === 0 || 
        selectedGrupoCobro.includes((contract as any).grupoCobro);
      
      return matchProductoProvision && matchEstadoVenta && matchEstadoProvision && matchProducto && matchTipo && matchRegional && matchGrupoAtraso && matchGestion && matchGrupoCobro;
    });
  }, [selectedProductoProvision, selectedEstadoVenta, selectedEstadoProvision, selectedProducto, selectedTipo, selectedRegional, selectedGrupoAtraso, selectedGestion, selectedGrupoCobro]);

  // KPIs globales
  const globalMetrics = useMemo(() => {
    const totalContracts = filteredData.length;
    const activeContracts = filteredData.filter(c => c.estadoProvision === 'Activo' || c.estadoProvision === 'Atrasado' || c.estadoVenta === 'Activo' || c.estadoVenta === 'Atrasado').length;
    const totalValue = filteredData.reduce((sum, c) => sum + c.valorTotalContrato, 0);
    const vencidoGroups = ['ATRASO DE 11 A 25', 'ATRASO DE 26 A 50', 'ATRASO DE 51 A 60', 'ATRASO DE 61 A 90', 'ATRASO MAYOR A 90'];
    const overdueContracts = filteredData.filter(c => vencidoGroups.includes(c.grupoAtraso)).length;
    const overdueValue = filteredData
      .filter(c => vencidoGroups.includes(c.grupoAtraso))
      .reduce((sum, c) => sum + c.valorTotalContrato, 0);

    const filteredBudget = budgetData.filter(b => selectedRegional.length === 0 || selectedRegional.includes(b.regional));
    const presupuesto = filteredBudget.reduce((sum, b) => sum + b.presupuesto, 0);
    const recaudo = filteredBudget.reduce((sum, b) => sum + b.recaudo, 0);
    const cumplimiento = presupuesto > 0 ? recaudo / presupuesto : 0;
    const faltante = Math.max(0, presupuesto - recaudo);

    // Calcular proyeccion
    const today = new Date();
    // Dias transcurridos hasta ayer
    const diasTranscurridos = Math.max(1, today.getDate() - 1); 
    // Dias totales del mes actual
    const diasTotalesMes = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    const proyeccionRecaudo = (recaudo / diasTranscurridos) * diasTotalesMes;
    const proyeccionCumplimiento = presupuesto > 0 ? (proyeccionRecaudo / presupuesto) : 0;

    return {
      totalContracts,
      activeContracts,
      totalValue,
      overdueContracts,
      overdueValue,
      activeRate: totalContracts > 0 ? (activeContracts / totalContracts) * 100 : 0,
      overdueRate: totalContracts > 0 ? (overdueContracts / totalContracts) * 100 : 0,
      presupuesto,
      recaudo,
      cumplimiento,
      faltante,
      proyeccionCumplimiento,
    };
  }, [filteredData, selectedRegional]);

  // Analisis por categorías
  const analysisByAtraso = useMemo(() => {
    const grouped = filteredData.reduce((acc, contract) => {
      const key = contract.grupoAtraso;
      
      if (!acc[key]) {
        acc[key] = { count: 0, totalValue: 0 };
      }
      acc[key].count += 1;
      acc[key].totalValue += contract.valorTotalContrato;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);

    return Object.entries(grouped)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredData]);

  const analysisByTipo = useMemo(() => {
    const grouped = filteredData.reduce((acc, contract) => {
      const key = contract.tipo;
      if (!acc[key]) {
        acc[key] = { count: 0, totalValue: 0 };
      }
      acc[key].count += 1;
      acc[key].totalValue += contract.valorTotalContrato;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);

    return Object.entries(grouped)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredData]);

  const analysisByGestion = useMemo(() => {
    const grouped = filteredData.reduce((acc, contract) => {
      const key = contract.gestion;
      if (!acc[key]) {
        acc[key] = { count: 0, totalValue: 0 };
      }
      acc[key].count += 1;
      acc[key].totalValue += contract.valorTotalContrato;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);

    return Object.entries(grouped)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredData]);

  const analysisByProducto = useMemo(() => {
    const grouped = filteredData.reduce((acc, contract) => {
      const key = contract.producto;
      if (!acc[key]) {
        acc[key] = { count: 0, totalValue: 0 };
      }
      acc[key].count += 1;
      acc[key].totalValue += contract.valorTotalContrato;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);

    return Object.entries(grouped)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredData]);

  const analysisByRegional = useMemo(() => {
    const grouped = filteredData.reduce((acc, contract) => {
      const key = (contract as any).regional;
      const atrasoKey = contract.grupoAtraso;

      if (!acc[key]) {
        acc[key] = { count: 0, totalValue: 0 };
      }
      acc[key].count += 1;
      acc[key].totalValue += contract.valorTotalContrato;
      
      if (!acc[key][atrasoKey]) {
        acc[key][atrasoKey] = 0;
        acc[key][`${atrasoKey}_count`] = 0;
      }
      acc[key][atrasoKey] += contract.valorTotalContrato;
      acc[key][`${atrasoKey}_count`] += 1;

      return acc;
    }, {} as Record<string, any>);

    return Object.entries(grouped)
      .map(([name, data]) => {
        const bd = budgetData.filter(b => b.regional === name);
        const p = bd.reduce((sum, b) => sum + b.presupuesto, 0);
        const r = bd.reduce((sum, b) => sum + b.recaudo, 0);
        const faltante = Math.max(0, p - r);

        const today = new Date();
        const diasTranscurridos = Math.max(1, today.getDate() - 1); 
        const diasTotalesMes = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const proyRecaudo = (r / diasTranscurridos) * diasTotalesMes;
        const proyeccionCumplimiento = p > 0 ? (proyRecaudo / p) : 0;

        return { 
          name, 
          ...data,
          presupuesto: p,
          recaudo: r,
          cumplimiento: p > 0 ? (r / p) : 0,
          faltante: faltante,
          proyeccionCumplimiento: proyeccionCumplimiento
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredData]);

  const analysisByGrupoCobro = useMemo(() => {
    const grouped = filteredData.reduce((acc, contract) => {
      const key = (contract as any).grupoCobro || 'Sin Grupo';
      const atrasoKey = contract.grupoAtraso;

      if (!acc[key]) {
        acc[key] = { count: 0, totalValue: 0 };
      }
      acc[key].count += 1;
      acc[key].totalValue += contract.valorTotalContrato;
      
      if (!acc[key][atrasoKey]) {
        acc[key][atrasoKey] = 0;
        acc[key][`${atrasoKey}_count`] = 0;
      }
      acc[key][atrasoKey] += contract.valorTotalContrato;
      acc[key][`${atrasoKey}_count`] += 1;

      return acc;
    }, {} as Record<string, any>);

    return Object.entries(grouped)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredData]);

  const orderedAtrasoKeys = [
    'ADELANTADO',
    'ANTICIPADO DE -10 A 0',
    'ATRASO DE 1 A 10',
    'ATRASO DE 11 A 25',
    'ATRASO DE 26 A 50',
    'ATRASO DE 51 A 60',
    'ATRASO DE 61 A 90',
    'ATRASO MAYOR A 90'
  ];

  const regionalStackedKeys = useMemo(() => {
    const keys = new Set<string>();
    analysisByRegional.forEach(item => {
      Object.keys(item).forEach(k => {
        if (k !== 'name' && k !== 'count' && k !== 'totalValue' && !k.endsWith('_count') && 
            k !== 'presupuesto' && k !== 'recaudo' && k !== 'cumplimiento' && 
            k !== 'faltante' && k !== 'proyeccionCumplimiento') keys.add(k);
      });
    });
    return Array.from(keys).sort((a, b) => {
      const idxA = orderedAtrasoKeys.indexOf(a);
      const idxB = orderedAtrasoKeys.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [analysisByRegional]);

  const grupoCobroStackedKeys = useMemo(() => {
    const keys = new Set<string>();
    analysisByGrupoCobro.forEach(item => {
      Object.keys(item).forEach(k => {
        if (k !== 'name' && k !== 'count' && k !== 'totalValue' && !k.endsWith('_count')) keys.add(k);
      });
    });
    return Array.from(keys).sort((a, b) => {
      const idxA = orderedAtrasoKeys.indexOf(a);
      const idxB = orderedAtrasoKeys.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [analysisByGrupoCobro]);

  const handleReset = () => {
    setSelectedProductoProvision([]);
    setSelectedEstadoVenta(['Aprobado', 'Aprobado Sc']);
    setSelectedEstadoProvision(['Activo', 'Atrasado']);
    setSelectedProducto(['Renacer Mascotas']);
    setSelectedTipo([]);
    setSelectedRegional([]);
    setSelectedGrupoAtraso([]);
    setSelectedGestion([]);
    setSelectedGrupoCobro([]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      <Header 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />
      
      <main className="container mx-auto px-4 py-8 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panel de Filtros (Sidebar) */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <FilterPanel
              isDarkMode={isDarkMode}
              filterOptions={filterOptions}
              selectedProductoProvision={selectedProductoProvision}
              setSelectedProductoProvision={setSelectedProductoProvision}
              selectedEstadoVenta={selectedEstadoVenta}
              setSelectedEstadoVenta={setSelectedEstadoVenta}
              selectedEstadoProvision={selectedEstadoProvision}
              setSelectedEstadoProvision={setSelectedEstadoProvision}
              selectedProducto={selectedProducto}
              setSelectedProducto={setSelectedProducto}
              selectedTipo={selectedTipo}
              setSelectedTipo={setSelectedTipo}
              selectedRegional={selectedRegional}
              setSelectedRegional={setSelectedRegional}
              selectedGrupoAtraso={selectedGrupoAtraso}
              setSelectedGrupoAtraso={setSelectedGrupoAtraso}
              selectedGestion={selectedGestion}
              setSelectedGestion={setSelectedGestion}
              selectedGrupoCobro={selectedGrupoCobro}
              setSelectedGrupoCobro={setSelectedGrupoCobro}
              onReset={handleReset}
            />
          </div>

          {/* Contenido Principal */}
          <div className="w-full lg:w-3/4 flex flex-col gap-6">
            
            {/* Pestañas de Navegación */}
            <div className={`flex flex-wrap border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <button 
                onClick={() => setActiveTab('analisis')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'analisis' 
                    ? 'border-blue-500 text-blue-500' 
                    : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <BarChart3 size={16} />
                Analisis de Datos
              </button>
              <button 
                onClick={() => setActiveTab('grupo_cobro')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'grupo_cobro' 
                    ? 'border-blue-500 text-blue-500' 
                    : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <TrendingUp size={16} />
                Analisis Grupo Cobro
              </button>
              <button 
                onClick={() => setActiveTab('alertas')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'alertas' 
                    ? 'border-blue-500 text-blue-500' 
                    : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <AlertCircle size={16} />
                Semaforizacion Alertas
              </button>
              <button 
                onClick={() => setActiveTab('mapa')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'mapa' 
                    ? 'border-blue-500 text-blue-500' 
                    : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <MapPin size={16} />
                Visor Geografico
              </button>
            </div>

            {/* KPIs Globales (Visibles en ambas pestañas) */}
            <MetricsGrid metrics={globalMetrics} isDarkMode={isDarkMode} />

            {activeTab === 'analisis' && (
              <>
                {/* Analisis por Regional */}
                <div className="mt-2">
                  <AnalysisSection
                    title="Analisis por Regional y Grupo Atraso"
                    icon={MapPin}
                    data={analysisByRegional}
                    isDarkMode={isDarkMode}
                    chartType="stacked-bar"
                    colorScheme="default"
                    stackedKeys={regionalStackedKeys}
                  />
                </div>

                {/* Grid de Analisis (Otros gráficos) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <AnalysisSection
                    title="Analisis por Atraso"
                    icon={AlertCircle}
                    data={analysisByAtraso}
                    isDarkMode={isDarkMode}
                    chartType="bar"
                    colorScheme="status"
                  />
                  
                  <AnalysisSection
                    title="Analisis por Tipo"
                    icon={BarChart3}
                    data={analysisByTipo}
                    isDarkMode={isDarkMode}
                    chartType="pie"
                    colorScheme="default"
                  />
                  
                  <AnalysisSection
                    title="Analisis por Gestion"
                    icon={TrendingUp}
                    data={analysisByGestion}
                    isDarkMode={isDarkMode}
                    chartType="bar"
                    colorScheme="management"
                  />
                  
                  <AnalysisSection
                    title="Analisis por Producto"
                    icon={DollarSign}
                    data={analysisByProducto}
                    isDarkMode={isDarkMode}
                    chartType="pie"
                    colorScheme="product"
                  />
                </div>
              </>
            )}

            {activeTab === 'grupo_cobro' && (
              <div className="mt-2 animate-in fade-in duration-500">
                <AnalysisSection
                  title="Analisis por Grupo Cobro y Grupo Atraso"
                  icon={TrendingUp}
                  data={analysisByGrupoCobro}
                  isDarkMode={isDarkMode}
                  chartType="stacked-bar"
                  colorScheme="status"
                  stackedKeys={grupoCobroStackedKeys}
                />
              </div>
            )}

            {activeTab === 'alertas' && (
              <div className="mt-2 animate-in fade-in duration-500">
                <AlertsSection data={filteredData} isDarkMode={isDarkMode} />
              </div>
            )}

            {activeTab === 'mapa' && (
              <div className="mt-2 animate-in fade-in duration-500">
                <MapSection data={filteredData} isDarkMode={isDarkMode} />
              </div>
            )}
          </div>
        </div>

        {/* Footer con información del dataset */}
        <div className={`mt-8 p-6 rounded-xl border backdrop-blur-sm ${
          isDarkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-white/70 border-slate-200'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Origen de datos: <span className="font-mono text-xs">C:\Users\Coord Planeacion\Documents\DASHBOARD SFUN\VIGENTES SFUN.xlsx</span>
              </p>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Desarrollado para Coordinación de Planeacion
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
