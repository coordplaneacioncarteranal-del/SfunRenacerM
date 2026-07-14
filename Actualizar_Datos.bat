@echo off
cd /d "%~dp0"
echo ===================================================
echo   ACTUALIZADOR DE DATOS - DASHBOARD SFUN
echo ===================================================
echo.
echo IMPORTANTE: Asegurate de que el archivo Excel "VIGENTES SFUN.xlsx"
echo este CERRADO antes de continuar.
echo.
echo Actualizando...
echo.

python update_data.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Hubo un problema al actualizar los datos.
) else (
    echo.
    echo ===================================================
    echo [EXITO] Proceso finalizado. 
    echo Ve a tu navegador y PRESIONA F5 para recargar la pagina.
    echo ===================================================
)
pause
