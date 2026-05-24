@echo off
echo Limpando cache do projeto...

echo.
echo [1/4] Limpando cache do Metro...
rd /s /q .expo 2>nul
rd /s /q node_modules\.cache 2>nul

echo.
echo [2/4] Limpando cache do npm...
npm cache clean --force

echo.
echo [3/4] Reinstalando dependencias...
del package-lock.json 2>nul
rd /s /q node_modules 2>nul
npm install

echo.
echo [4/4] Iniciando servidor...
npx expo start --clear

pause
