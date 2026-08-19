import { Filter, X } from 'lucide-react';
import { MultiSelect } from './MultiSelect';

interface FilterPanelProps {
  isDarkMode: boolean;
  filterOptions: {
    productoProvision: string[];
    estadoVenta: string[];
    estadoProvision: string[];
    producto: string[];
    tipo: string[];
    regional: string[];
    grupoAtraso: string[];
    gestion: string[];
    grupoCobro: string[];
  };
  selectedProductoProvision: string[];
  setSelectedProductoProvision: (value: string[]) => void;
  selectedEstadoVenta: string[];
  setSelectedEstadoVenta: (value: string[]) => void;
  selectedEstadoProvision: string[];
  setSelectedEstadoProvision: (value: string[]) => void;
  selectedProducto: string[];
  setSelectedProducto: (value: string[]) => void;
  selectedTipo: string[];
  setSelectedTipo: (value: string[]) => void;
  selectedRegional: string[];
  setSelectedRegional: (value: string[]) => void;
  selectedGrupoAtraso: string[];
  setSelectedGrupoAtraso: (value: string[]) => void;
  selectedGestion: string[];
  setSelectedGestion: (value: string[]) => void;
  selectedGrupoCobro: string[];
  setSelectedGrupoCobro: (value: string[]) => void;
  onReset: () => void;
}

export function FilterPanel({
  isDarkMode,
  filterOptions,
  selectedProductoProvision,
  setSelectedProductoProvision,
  selectedEstadoVenta,
  setSelectedEstadoVenta,
  selectedEstadoProvision,
  setSelectedEstadoProvision,
  selectedProducto,
  setSelectedProducto,
  selectedTipo,
  setSelectedTipo,
  selectedRegional,
  setSelectedRegional,
  selectedGrupoAtraso,
  setSelectedGrupoAtraso,
  selectedGestion,
  setSelectedGestion,
  selectedGrupoCobro,
  setSelectedGrupoCobro,
  onReset,
}: FilterPanelProps) {
  const hasActiveFilters = 
    selectedProductoProvision.length > 0 ||
    selectedEstadoVenta.length > 0 ||
    selectedEstadoProvision.length > 0 ||
    selectedProducto.length > 0 ||
    selectedTipo.length > 0 ||
    selectedRegional.length > 0 ||
    selectedGrupoAtraso.length > 0 ||
    selectedGestion.length > 0 ||
    selectedGrupoCobro.length > 0;

  return (
    <div className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white/70 border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <Filter className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Filtros de Análisis
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Personaliza la visualización de datos
            </p>
          </div>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              isDarkMode 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <MultiSelect
          label="Producto"
          options={filterOptions.producto}
          selected={selectedProducto}
          onChange={setSelectedProducto}
          isDarkMode={isDarkMode}
        />
        
        <MultiSelect
          label="Producto Previsión"
          options={filterOptions.productoProvision}
          selected={selectedProductoProvision}
          onChange={setSelectedProductoProvision}
          isDarkMode={isDarkMode}
        />
        
        <MultiSelect
          label="Estado de Venta"
          options={filterOptions.estadoVenta}
          selected={selectedEstadoVenta}
          onChange={setSelectedEstadoVenta}
          isDarkMode={isDarkMode}
        />
        
        <MultiSelect
          label="Estado Previsión"
          options={filterOptions.estadoProvision}
          selected={selectedEstadoProvision}
          onChange={setSelectedEstadoProvision}
          isDarkMode={isDarkMode}
        />
        
        <MultiSelect
          label="Tipo"
          options={filterOptions.tipo}
          selected={selectedTipo}
          onChange={setSelectedTipo}
          isDarkMode={isDarkMode}
        />
        
        <MultiSelect
          label="Regional"
          options={filterOptions.regional}
          selected={selectedRegional}
          onChange={setSelectedRegional}
          isDarkMode={isDarkMode}
        />

        <MultiSelect
          label="Grupo Atraso"
          options={filterOptions.grupoAtraso}
          selected={selectedGrupoAtraso}
          onChange={setSelectedGrupoAtraso}
          isDarkMode={isDarkMode}
        />
        
        <MultiSelect
          label="Gestión"
          options={filterOptions.gestion}
          selected={selectedGestion}
          onChange={setSelectedGestion}
          isDarkMode={isDarkMode}
        />
        
        <MultiSelect
          label="Grupo de Cobro"
          options={filterOptions.grupoCobro}
          selected={selectedGrupoCobro}
          onChange={setSelectedGrupoCobro}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}
