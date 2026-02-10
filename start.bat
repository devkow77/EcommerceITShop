@echo off
REM ============================================
REM  EcommerceITShop Startup Script
REM ============================================
REM  Przygotowuje całą aplikację do uruchomienia

setlocal enabledelayedexpansion

echo.
echo ============================================
echo  EcommerceITShop - Startup Script
echo ============================================
echo.

REM Sprawdzenie czy jesteśmy w głównym katalogu projektu
if not exist "backend\package.json" (
    echo BŁĄD: Nie znaleziono backend\package.json
    echo Uruchom ten skrypt z głównego katalogu projektu
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo BŁĄD: Nie znaleziono frontend\package.json
    echo Uruchom ten skrypt z głównego katalogu projektu
    pause
    exit /b 1
)

REM ============================================
REM  Instalacja zależności BACKEND
REM ============================================
echo.
echo [1/5] Instalacja dependencji Backend...
echo ============================================
cd backend
call npm install
if !errorlevel! neq 0 (
    echo BŁĄD: Nie udało się zainstalować dependencji backend
    pause
    exit /b 1
)

REM ============================================
REM  Instalacja zależności FRONTEND
REM ============================================
echo.
echo [2/5] Instalacja dependencji Frontend...
echo ============================================
cd ..\frontend
call npm install
if !errorlevel! neq 0 (
    echo BŁĄD: Nie udało się zainstalować dependencji frontend
    pause
    exit /b 1
)

cd ..

REM ============================================
REM  Generowanie Prisma Client
REM ============================================
echo.
echo [3/5] Generowanie Prisma Client...
echo ============================================
cd backend
call npx prisma generate
if !errorlevel! neq 0 (
    echo OSTRZEŻENIE: Generowanie Prisma Client nie powiodło się
)

REM ============================================
REM  Seedowanie bazy danych
REM ============================================
echo.
echo [4/5] Seedowanie bazy danych...
echo ============================================
call npx prisma db seed
if !errorlevel! neq 0 (
    echo OSTRZEŻENIE: Seedowanie bazy danych nie powiodło się
)

cd ..

REM ============================================
REM  Uruchomienie Backend i Frontend
REM ============================================
echo.
echo [5/5] Uruchomienie Backend i Frontend...
echo ============================================
echo.
echo Otwieranie Backend...
cd backend
start "EcommerceITShop - Backend" cmd /k npm run dev

echo Czekanie 3 sekundy przed uruchomieniem Frontend...
timeout /t 3 /nobreak

cd ..\frontend
echo Otwieranie Frontend...
start "EcommerceITShop - Frontend" cmd /k npm run dev

echo.
echo ============================================
echo  Aplikacja uruchomiona!
echo ============================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Zamknij to okno lub naciśnij Ctrl+C aby zatrzymać
echo.
pause
