# 🚀 Guía Rápida - Dashboard SFUN

## ⚡ Inicio en 3 Pasos

### 1️⃣ Instalar Dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:

\`\`\`bash
npm install
\`\`\`

⏱️ **Tiempo estimado**: 2-3 minutos

---

### 2️⃣ Iniciar el Dashboard
Una vez instaladas las dependencias:

\`\`\`bash
npm run dev
\`\`\`

🌐 **URL**: http://localhost:5173

El navegador se abrirá automáticamente mostrando el dashboard.

---

### 3️⃣ Explorar el Dashboard

#### 📊 Panel de Control

El dashboard está dividido en 4 secciones principales:

1. **Filtros Superiores** (Barra gris/oscura)
   - Producto Previsión
   - Estado de Venta
   - Estado Previsión
   - Producto
   
   ✨ **Tip**: Selecciona múltiples opciones haciendo clic en cada filtro

2. **KPIs Globales** (6 tarjetas de métricas)
   - Total Contratos
   - Contratos Activos
   - Valor Total Cartera
   - Contratos Vencidos
   - Valor en Mora
   - Tasa de Cumplimiento

3. **Módulos de Análisis** (4 secciones con gráficos)
   - Análisis por Atraso
   - Análisis por Tipo
   - Análisis por Gestión
   - Análisis por Producto

4. **Información del Dataset** (Footer)
   - Ruta del archivo Excel
   - Fecha de actualización
   - Contratos visualizados

---

## 🎨 Funcionalidades Clave

### 🌙 Modo Oscuro/Claro
Haz clic en el icono de **luna/sol** en la esquina superior derecha para cambiar el tema.

### 🔍 Filtrado Interactivo
1. Haz clic en cualquier filtro
2. Selecciona una o más opciones
3. Los gráficos se actualizan automáticamente
4. Para limpiar: Botón **"Limpiar filtros"**

### 📈 Gráficos Interactivos
- **Hover**: Pasa el mouse sobre los gráficos para ver detalles
- **Tooltips**: Muestra valores exactos y porcentajes
- **Leyendas**: Haz clic para ocultar/mostrar series

### 📋 Tablas Detalladas
Cada módulo incluye una tabla con:
- Categoría con indicador de color
- Número de contratos
- Valor total
- Porcentaje del total
- **FILA TOTAL** al final

---

## 💡 Casos de Uso Comunes

### Caso 1: Ver solo contratos vencidos
1. Filtro "Estado Previsión" → Seleccionar "Vencido"
2. Observa los KPIs de mora y valor vencido
3. Revisa el análisis por atraso

### Caso 2: Análisis de Créditos activos
1. Filtro "Producto" → Seleccionar "Crédito"
2. Filtro "Estado de Venta" → Seleccionar "Activo"
3. Revisa el valor total en la cartera de créditos

### Caso 3: Identificar productos problemáticos
1. Observa el módulo "Análisis por Producto"
2. Identifica productos con mayor mora
3. Cruza con "Análisis por Gestión" para ver estrategias

### Caso 4: Reporte ejecutivo mensual
1. Deja los filtros en "Todos"
2. Captura de pantalla de KPIs globales
3. Exporta o presenta el análisis completo

---

## 🛠️ Comandos Útiles

### Desarrollo
\`\`\`bash
npm run dev        # Inicia servidor de desarrollo
\`\`\`

### Producción
\`\`\`bash
npm run build      # Compila para producción
npm run preview    # Previsualiza versión compilada
\`\`\`

### Mantenimiento
\`\`\`bash
npm install        # Reinstala dependencias
npm update         # Actualiza paquetes
\`\`\`

---

## 📊 Interpretación de Datos

### KPIs Clave

#### 🟢 Tasa de Cumplimiento Alta (>90%)
- **Significado**: Cartera saludable
- **Acción**: Mantener estrategias actuales

#### 🟡 Tasa de Cumplimiento Media (70-90%)
- **Significado**: Atención requerida
- **Acción**: Revisar procesos de cobro

#### 🔴 Tasa de Cumplimiento Baja (<70%)
- **Significado**: Riesgo alto
- **Acción**: Intervención urgente

### Grupos de Atraso

- **Sin atraso**: Contratos al día ✅
- **1-30 días**: Cobro prejudicial 🟡
- **31-60 días**: Alerta temprana 🟠
- **61-90 días**: Riesgo medio 🔴
- **Más de 90 días**: Cobro jurídico ⛔

---

## 🎯 Atajos de Teclado

| Acción | Atajo |
|--------|-------|
| Actualizar página | F5 o Ctrl+R |
| Modo Pantalla Completa | F11 |
| Zoom In | Ctrl + "+" |
| Zoom Out | Ctrl + "-" |
| Zoom Reset | Ctrl + 0 |
| Abrir DevTools | F12 |

---

## 📱 Uso en Diferentes Dispositivos

### 💻 Desktop (Recomendado)
- Pantalla: ≥ 1366x768
- Navegador: Chrome, Edge, Firefox
- Experiencia: Completa

### 📱 Tablet
- Pantalla: ≥ 768px
- Orientación: Landscape recomendado
- Experiencia: Buena (scroll horizontal en tablas)

### 📲 Móvil
- Pantalla: ≥ 375px
- Experiencia: Limitada (mejor para consultas rápidas)

---

## 🚨 Solución Rápida de Problemas

### ❌ Error: "npm: command not found"
**Solución**: Instala Node.js desde https://nodejs.org/

### ❌ Error: "Port 5173 is already in use"
**Solución**: 
\`\`\`bash
npm run dev -- --port 3000
\`\`\`

### ❌ Dashboard muestra "No hay datos"
**Solución**: 
1. Verifica que \`src/data/contractsData.ts\` existe
2. Limpia filtros con el botón "Limpiar filtros"
3. Recarga la página (F5)

### ❌ Gráficos no se ven
**Solución**:
1. Limpia caché: Ctrl + Shift + R
2. Verifica consola: F12 → Console
3. Reinstala dependencias: \`npm install\`

### ❌ Modo oscuro no funciona
**Solución**: 
- Haz clic en el icono de luna/sol en el header
- Si persiste, limpia localStorage:
  \`\`\`javascript
  localStorage.clear()
  \`\`\`

---

## 📞 Contacto y Soporte

**Coordinación de Planeación**  
Dashboard SFUN - Contratos Vigentes

Para reportar problemas o sugerencias:
1. Documenta el error (captura de pantalla)
2. Describe los pasos para reproducirlo
3. Indica navegador y versión
4. Contacta al equipo de desarrollo

---

## 🎓 Próximos Pasos

1. ✅ Familiarízate con los filtros
2. ✅ Explora cada módulo de análisis
3. ✅ Prueba el modo oscuro
4. ✅ Genera tu primer reporte ejecutivo
5. 📚 Lee el README.md completo para funciones avanzadas

---

## 📈 Mejores Prácticas

### Para Presentaciones Ejecutivas
1. Usa **modo oscuro** para proyectores
2. Filtra por **producto específico** para enfoque
3. Captura **KPIs globales** para resumen
4. Exporta **tablas detalladas** para análisis

### Para Análisis Diario
1. Revisa **contratos vencidos** cada mañana
2. Monitorea **tasa de cumplimiento** semanalmente
3. Compara **análisis por gestión** mensualmente
4. Identifica **tendencias por producto** trimestralmente

### Para Toma de Decisiones
1. Cruza **múltiples filtros** para insights profundos
2. Observa **porcentajes relativos** en tablas
3. Prioriza por **valor total** (no solo cantidad)
4. Valida con **datos del Excel original**

---

**¡Dashboard listo para usar! 🎉**

Última actualización: 2024  
Versión: 1.0.0
