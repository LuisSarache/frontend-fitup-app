@echo off
echo ========================================
echo FitUp - Limpeza e Rebuild Android
echo ========================================
echo.

echo [1/6] Limpando cache do Metro...
call npx react-native start --reset-cache
timeout /t 2 /nobreak >nul

echo.
echo [2/6] Limpando node_modules...
rmdir /s /q node_modules 2>nul
echo.

echo [3/6] Reinstalando dependencias...
call npm install
echo.

echo [4/6] Limpando build Android...
cd android
call gradlew clean
cd ..
echo.

echo [5/6] Limpando cache do Gradle...
rmdir /s /q android\.gradle 2>nul
rmdir /s /q android\app\build 2>nul
echo.

echo [6/6] Gerando novo APK...
call npx expo run:android --variant release
echo.

echo ========================================
echo Processo concluido!
echo ========================================
pause
