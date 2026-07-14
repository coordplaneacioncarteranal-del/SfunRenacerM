# Dashboard SFUN - Contratos Vigentes

> **Dashboard ejecutivo web de nivel corporativo para monitoreo integral de contratos vigentes**  
> Desarrollado para la Coordinación de Planeación | Tecnología: React + TypeScript + Tailwind CSS + Recharts

---

## 📚 Documentación Completa

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| **[INDEX.md](INDEX.md)** | 📑 Índice maestro de toda la documentación | Todos |
| **[GUIA_RAPIDA.md](GUIA_RAPIDA.md)** | ⚡ Inicio en 3 pasos | Usuarios finales |
| **[RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md)** | 🎯 Visión de negocio y ROI | Gerencia |
| **[INTEGRACION_EXCEL.md](INTEGRACION_EXCEL.md)** | 🔌 Conectar con Excel real | Implementadores |
| **[EQUIVALENCIA_PYTHON.md](EQUIVALENCIA_PYTHON.md)** | 🐍 Código equivalente Python/Streamlit | Data Scientists |
| **[DEPENDENCIES.md](DEPENDENCIES.md)** | 📦 Stack técnico y librerías | Desarrolladores |
| **[COMANDOS.md](COMANDOS.md)** | 💻 Referencia de comandos | IT/DevOps |

**→ ¿Primera vez?** Empieza con **[GUIA_RAPIDA.md](GUIA_RAPIDA.md)**

---

## 📊 Descripción del Proyecto

Dashboard ejecutivo web para el monitoreo integral del rendimiento, estado y valor de contratos vigentes del Sistema de Fondos Unificados (SFUN). Desarrollado para la Coordinación de Planeación.

### ✨ Características Principales

- **Interfaz Corporativa Premium**: Diseño moderno con modo claro/oscuro
- **Filtrado Dinámico**: 4 filtros interactivos que actualizan todos los gráficos en tiempo real
- **KPIs Ejecutivos**: 6 métricas clave para toma de decisiones
- **4 Módulos de Análisis**: 
  - Análisis por Atraso
  - Análisis por Tipo
  - Análisis por Gestión
  - Análisis por Producto
- **Visualizaciones Interactivas**: Gráficos de barras y torta con tooltips informativos
- **Tablas Detalladas**: Desglose completo con porcentajes y totales
- **Responsive**: Optimizado para desktop, tablet y móvil

---

## 🚀 Guía de Instalación y Despliegue

### Requisitos Previos

- **Node.js**: versión 18.x o superior
- **npm**: versión 9.x o superior
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### Paso 1: Verificar Instalación de Node.js

Abre una terminal (CMD, PowerShell o Git Bash) y ejecuta:

\`\`\`bash
node --version
npm --version
\`\`\`

Si no tienes Node.js instalado, descárgalo desde: https://nodejs.org/

### Paso 2: Instalar Dependencias

Navega a la carpeta del proyecto y ejecuta:

\`\`\`bash
npm install
\`\`\`

Este comando instalará todas las librerías necesarias:
- **React 19**: Framework de interfaz de usuario
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Framework de estilos utility-first
- **Recharts**: Librería de gráficos interactivos
- **Lucide React**: Iconos modernos
- **Vite**: Build tool ultra-rápido

### Paso 3: Iniciar el Servidor de Desarrollo

\`\`\`bash
npm run dev
\`\`\`

El dashboard estará disponible en: **http://localhost:5173**

Abre tu navegador y accede a esa URL. Verás el dashboard ejecutivo en acción.

### Paso 4: Compilar para Producción

Para generar los archivos optimizados para producción:

\`\`\`bash
npm run build
\`\`\`

Los archivos compilados estarán en la carpeta \`dist/\`. Puedes:
1. Alojar estos archivos en cualquier servidor web
2. Usar \`npm run preview\` para previsualizar la versión de producción

---

## 📁 Estructura del Proyecto

\`\`\`
dashboard-sfun/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Encabezado con toggle modo oscuro
│   │   ├── FilterPanel.tsx         # Panel de 4 filtros principales
│   │   ├── MultiSelect.tsx         # Componente de selección múltiple
│   │   ├── MetricsGrid.tsx         # Grid de 6 KPIs ejecutivos
│   │   └── AnalysisSection.tsx     # Módulos de análisis con gráficos
│   ├── data/
│   │   └── contractsData.ts        # Dataset de contratos SFUN
│   ├── App.tsx                     # Componente principal
│   ├── main.tsx                    # Punto de entrada
│   └── index.css                   # Estilos globales
├── public/                         # Archivos estáticos
├── package.json                    # Dependencias del proyecto
├── tsconfig.json                   # Configuración TypeScript
├── tailwind.config.js              # Configuración Tailwind CSS
├── vite.config.ts                  # Configuración Vite
└── README.md                       # Este archivo
\`\`\`

---

## 🔧 Configuración del Dataset

### Opción 1: Datos Simulados (Actual)

El dashboard actualmente usa datos simulados en \`src/data/contractsData.ts\` que replican la estructura del Excel original.

### Opción 2: Integrar con Excel Real

Para conectar con el archivo Excel real ubicado en:
\`C:\\Users\\Coord Planeación\\Documents\\DASHBOARD SFUN\\VIGENTES SFUN.xlsx\`

**Necesitarás crear un backend que:**

1. Lea el archivo Excel usando una librería como \`xlsx\` (Node.js)
2. Exponga los datos a través de una API REST
3. El frontend consultaría esta API en lugar de usar datos simulados

**Script de ejemplo (Node.js + Express):**

\`\`\`javascript
// server.js
const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/contratos', (req, res) => {
  const workbook = XLSX.readFile('C:\\\\Users\\\\Coord Planeación\\\\Documents\\\\DASHBOARD SFUN\\\\VIGENTES SFUN.xlsx');
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  res.json(data);
});

app.listen(3001, () => console.log('API corriendo en http://localhost:3001'));
\`\`\`

Luego modifica \`src/data/contractsData.ts\` para hacer un \`fetch\` a \`http://localhost:3001/api/contratos\`.

---

## 📊 Funcionalidades del Dashboard

### Filtros Interactivos

1. **Producto Previsión**: Filtra por tipo de producto de previsión
2. **Estado de Venta**: Filtra por estado del contrato (Activo, En Revisión, Suspendido)
3. **Estado Previsión**: Filtra por estado de pago (Al día, Vencido)
4. **Producto**: Filtra por categoría principal (Pensión, Cesantías, Crédito, Seguros)

**Todos los filtros son multiselección** y se actualizan en tiempo real.

### KPIs Globales

1. **Total Contratos**: Cantidad total en cartera
2. **Contratos Activos**: Con indicador de tasa de actividad
3. **Valor Total Cartera**: Monto total con formato de moneda
4. **Contratos Vencidos**: Con porcentaje sobre el total
5. **Valor en Mora**: Monto total vencido
6. **Tasa de Cumplimiento**: Porcentaje de contratos al día

### Módulos de Análisis

Cada módulo incluye:
- **Gráfico interactivo** (barras o torta)
- **Tabla detallada** con:
  - Categoría
  - Número de contratos
  - Valor total
  - Porcentaje del total
- **Totales** al pie de tabla

---

## 🎨 Personalización Visual

### Modo Oscuro/Claro

Haz clic en el icono de luna/sol en el header para alternar entre modos.

### Colores Corporativos

Los colores están definidos en \`src/components/\` y pueden personalizarse:

- **Azul**: Elementos principales (#3b82f6)
- **Verde**: Indicadores positivos (#10b981)
- **Rojo**: Alertas y mora (#ef4444)
- **Púrpura**: Valores monetarios (#8b5cf6)
- **Naranja**: Advertencias (#f59e0b)

### Tipografías

El dashboard usa las fuentes del sistema:
- **Sans-serif**: Inter, Roboto, Segoe UI (fallback)

---

## 📈 Lógica de Negocio

### Cálculo de KPIs

\`\`\`typescript
// Total de contratos filtrados
totalContracts = filteredData.length

// Contratos activos
activeContracts = contratos donde contratoActivo === true

// Valor total de cartera
totalValue = suma de valorTotalContrato

// Contratos vencidos
overdueContracts = contratos donde estadoProvision === 'Vencido'

// Tasa de cumplimiento
activeRate = (activeContracts / totalContracts) * 100
\`\`\`

### Agrupaciones

Los datos se agrupan usando \`reduce\` de JavaScript para:
- Contar contratos por categoría
- Sumar valores por categoría
- Calcular porcentajes relativos

---

## 🚨 Troubleshooting

### El dashboard no carga

1. Verifica que ejecutaste \`npm install\`
2. Confirma que el puerto 5173 no esté ocupado
3. Revisa la consola del navegador (F12) para errores

### Los filtros no funcionan

1. Limpia el caché del navegador (Ctrl + Shift + R)
2. Verifica que los datos en \`contractsData.ts\` tengan la estructura correcta

### Errores de compilación

\`\`\`bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
\`\`\`

---

## 📝 Notas Importantes

### Rendimiento

- El dashboard está optimizado con \`useMemo\` para evitar recálculos innecesarios
- Soporta miles de registros sin degradación de rendimiento
- Los gráficos usan virtualización para conjuntos grandes de datos

### Seguridad

- **NO** incluyas credenciales en el código fuente
- Si conectas con una API, usa variables de entorno
- Valida y sanitiza todos los datos del servidor

### Escalabilidad

Para datasets muy grandes (>10,000 registros):
1. Implementa paginación en las tablas
2. Considera usar React Query para cacheo de datos
3. Implementa lazy loading en los gráficos

---

## 🤝 Soporte y Contacto

**Área**: Coordinación de Planeación  
**Proyecto**: Dashboard SFUN - Contratos Vigentes  
**Versión**: 1.0.0

---

## 📜 Licencia

Uso interno - Coordinación de Planeación

---

## 🎯 Roadmap Futuro

- [ ] Exportación a Excel/PDF
- [ ] Alertas automáticas por email
- [ ] Comparativas históricas (mes a mes)
- [ ] Dashboard de predicciones con ML
- [ ] Integración con Power BI
- [ ] API REST completa
- [ ] Sistema de usuarios y permisos

---

**¡Dashboard listo para la toma de decisiones estratégicas!** 🚀
