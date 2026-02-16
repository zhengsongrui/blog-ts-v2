@echo off
chcp 65001 >nul
echo ========================================
echo   Blog TS v2 Database Setup Script
echo ========================================
echo.

REM Check if we're in server directory
if not exist "prisma\schema.prisma" (
    echo [ERROR] Please run this script from the server directory.
    echo Current directory: %cd%
    echo.
    pause
    exit /b 1
)

echo [INFO] Found Prisma schema file.
echo [INFO] Syncing database structure...
echo.

REM Run Prisma db push with force reset to avoid foreign key constraint errors
npx prisma db push --skip-generate --force-reset
if %errorlevel% neq 0 (
    echo [ERROR] Database sync failed.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Database tables created/synced.
echo.

REM Ask about Prisma Client generation
set /p generate="Generate Prisma Client? (y/N): "
if /i "%generate%"=="y" (
    echo [INFO] Generating Prisma Client...
    npx prisma generate
    if %errorlevel% neq 0 (
        echo [WARNING] Prisma Client generation failed, but database is ready.
    ) else (
        echo [SUCCESS] Prisma Client generated.
    )
) else (
    echo [SKIP] Prisma Client not generated.
)

echo.
echo ========================================
echo   Database setup completed!
echo ========================================
echo.
pause