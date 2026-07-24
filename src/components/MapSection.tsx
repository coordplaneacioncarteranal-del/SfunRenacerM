import React, { useMemo, useEffect, useRef } from 'react';
import { Contract } from '../data/contractsData';
import { Map as MapIcon } from 'lucide-react';

interface MapSectionProps {
  data: Contract[];
  isDarkMode: boolean;
}

export function MapSection({ data, isDarkMode }: MapSectionProps) {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // Filtramos solo aquellos que tienen coordenadas numéricas válidas
  const validData = useMemo(() => {
    return data.filter(c => 
      c.latitud !== undefined && 
      c.longitud !== undefined && 
      c.latitud !== null && 
      c.longitud !== null && 
      !isNaN(Number(c.latitud)) && 
      !isNaN(Number(c.longitud)) &&
      (c.latitud !== 0 || c.longitud !== 0)
    );
  }, [data]);

  const center = useMemo(() => {
    if (validData.length === 0) return [4.5709, -74.2973] as [number, number]; // Centro de Colombia por defecto
    
    // Promedio de coordenadas para centrar el mapa
    let latSum = 0;
    let lngSum = 0;
    validData.forEach(c => {
      latSum += Number(c.latitud);
      lngSum += Number(c.longitud);
    });
    return [latSum / validData.length, lngSum / validData.length] as [number, number];
  }, [validData]);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    // Inicializar mapa si no existe
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, 6);
      
      const tileUrl = isDarkMode 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        
      L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
      
      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    } else {
      // Actualizar vista y tilelayer
      mapInstanceRef.current.setView(center, mapInstanceRef.current.getZoom());
      
      const tileUrl = isDarkMode 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      
      // Remover layers anteriores y poner el nuevo
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          layer.setUrl(tileUrl);
        }
      });
    }

    // Actualizar marcadores
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
      
      // Corrección de icono por defecto por si acaso
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      validData.forEach((contract) => {
        const popupContent = `
          <div style="font-size: 13px; min-width: 200px;">
            <p style="font-weight: bold; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">${contract.cliente || 'Sin nombre'}</p>
            <p style="margin: 4px 0;"><strong>Dirección:</strong> ${contract.direccion || 'No disponible'}</p>
            <p style="margin: 4px 0;"><strong>Regional:</strong> ${contract.regional}</p>
            <p style="margin: 4px 0;"><strong>Estado:</strong> ${contract.grupoAtraso}</p>
            <p style="margin-top: 8px; font-weight: bold; color: #2563eb; background-color: #eff6ff; padding: 6px; border-radius: 4px;">
              Valor: ${formatCurrency(contract.valorTotalContrato)}
            </p>
          </div>
        `;
        
        L.marker([Number(contract.latitud), Number(contract.longitud)], { icon: customIcon })
         .bindPopup(popupContent)
         .addTo(markersLayerRef.current);
      });
    }

  }, [validData, center, isDarkMode]);

  return (
    <div className={`p-6 rounded-xl border backdrop-blur-sm transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white/70 border-slate-200'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isDarkMode ? 'bg-slate-700 text-blue-400' : 'bg-blue-100 text-blue-600'
        }`}>
          <MapIcon size={24} />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Visor Geográfico
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Ubicación regional de contratos
          </p>
        </div>
      </div>

      <div className={`h-[500px] w-full rounded-xl overflow-hidden border shadow-sm relative z-0 ${
        isDarkMode ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      </div>
      <div className={`mt-4 text-sm font-medium flex items-center justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        <span>Mostrando {validData.length} ubicaciones en el mapa.</span>
        <span>(Filtros activos aplicados)</span>
      </div>
    </div>
  );
}
