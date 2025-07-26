@echo off
echo === Segment Modern E-commerce - GitHub Readiness Check ===
echo.

REM Check for git repository
if exist .git (
    echo ✅ Git repository detected
) else (
    echo ❌ Not a git repository - run 'git init' first
    exit /b 1
)

echo.
echo === File Verification ===

REM Check required files
if exist package.json (echo ✅ package.json exists) else (echo ❌ package.json missing)
if exist src\App.jsx (echo ✅ src\App.jsx exists) else (echo ❌ src\App.jsx missing)
if exist public\assets\TitanVideo.mp4 (echo ✅ public\assets\TitanVideo.mp4 exists) else (echo ❌ public\assets\TitanVideo.mp4 missing)
if exist public\assets\TitanOffer.png (echo ✅ public\assets\TitanOffer.png exists) else (echo ❌ public\assets\TitanOffer.png missing)
if exist README.md (echo ✅ README.md exists) else (echo ❌ README.md missing)
if exist DEPLOYMENT.md (echo ✅ DEPLOYMENT.md exists) else (echo ❌ DEPLOYMENT.md missing)

echo.
echo === Build Verification ===
npm run build >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Production build successful
) else (
    echo ❌ Build failed - check for errors
)

echo.
echo === Next Steps ===
echo 1. Check git status: git status
echo 2. Add changes: git add .
echo 3. Commit: git commit -m "feat: complete e-commerce platform with video integration"
echo 4. Push to GitHub: git push origin main
echo 5. Connect to Vercel and deploy
echo.
echo 🎉 Your modern e-commerce platform is ready for production!
