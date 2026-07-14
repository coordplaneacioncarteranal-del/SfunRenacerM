import pandas as pd
import json
import math
import os
from datetime import datetime

def clean_string(val):
    if pd.isna(val):
        return ""
    return str(val).strip()

def clean_float(val):
    if pd.isna(val) or val == "":
        return 0
    try:
        return float(val)
    except:
        return 0

def clean_date(val):
    if pd.isna(val):
        return ""
    if isinstance(val, datetime):
        return val.strftime("%Y-%m-%d")
    return str(val)[:10]

# Load Excel
try:
    df = pd.read_excel('VIGENTES SFUN.xlsx')
except PermissionError:
    print("ERROR: El archivo Excel esta abierto. Por favor, cierralo en Excel y vuelve a correr el archivo .bat.")
    exit(1)
except FileNotFoundError:
    print("ERROR: No se encontro el archivo 'VIGENTES SFUN.xlsx' en la carpeta.")
    exit(1)
except Exception as e:
    print(f"ERROR al leer el Excel: {e}")
    exit(1)

# Clean column names (handle encoding issues if any)
cols = df.columns.tolist()

def find_col(possible_names):
    for c in cols:
        for p in possible_names:
            if p.lower() in c.lower():
                return c
    return None

col_id = find_col(['Id de contrato', 'LLAVE', 'ID'])
col_prod_prov = find_col(['Producto Previsi'])
col_estado_venta = find_col(['Estado de venta'])
col_estado_prov = find_col(['Estado Previsi'])
col_producto = 'PRODUCTO' if 'PRODUCTO' in cols else find_col(['PRODUCTO'])
col_grupo_atraso = find_col(['grupo atraso'])
col_tipo = 'tipo' if 'tipo' in cols else find_col(['tipo'])
col_gestion = find_col(['GESTION'])
col_valor = find_col(['Valor total del contrato'])
col_regional = find_col(['Regional'])
col_fecha_inicio = find_col(['Fecha de Inicio', 'Inicio Vigencia'])
col_fecha_fin = find_col(['Fecha Renovaci', 'Hasta'])
col_cliente = find_col(['Contratante', 'Cliente'])

contracts = []
for index, row in df.iterrows():
    estado_venta_val = clean_string(row.get(col_estado_venta, ""))
    
    contract = {
        "id": clean_string(row.get(col_id, f"SFUN-{index}")),
        "productoProvision": clean_string(row.get(col_prod_prov, "")),
        "estadoVenta": estado_venta_val,
        "estadoProvision": clean_string(row.get(col_estado_prov, "")),
        "producto": clean_string(row.get(col_producto, "")) or "Sin Producto",
        "grupoAtraso": clean_string(row.get(col_grupo_atraso, "")),
        "tipo": clean_string(row.get(col_tipo, "")),
        "gestion": clean_string(row.get(col_gestion, "")),
        "regional": "BOGOTA" if "bogota" in clean_string(row.get(col_regional, "")).lower() else clean_string(row.get(col_regional, "")),
        "valorTotalContrato": clean_float(row.get(col_valor, 0)),
        "contratoActivo": estado_venta_val.lower() == 'activo',
        "fechaInicio": clean_date(row.get(col_fecha_inicio, "")),
        "fechaFin": clean_date(row.get(col_fecha_fin, "")),
        "cliente": clean_string(row.get(col_cliente, ""))
    }
    contracts.append(contract)

now = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

ts_content = f"""// Datos generados automáticamente desde el Excel "VIGENTES SFUN.xlsx"

export const lastUpdate = "{now}";

export interface Contract {{
  id: string;
  productoProvision: string;
  estadoVenta: string;
  estadoProvision: string;
  producto: string;
  grupoAtraso: string;
  tipo: string;
  gestion: string;
  regional: string;
  valorTotalContrato: number;
  contratoActivo: boolean;
  fechaInicio: string;
  fechaFin: string;
  cliente: string;
}}

export const contractsData: Contract[] = """ + json.dumps(contracts, indent=2, ensure_ascii=False) + """;
"""

with open('src/data/contractsData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Se han procesado {len(contracts)} contratos y actualizado src/data/contractsData.ts")
