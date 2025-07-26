#!/bin/bash

# 🚀 GitHub Deployment Readiness Check
echo "=== Segment Modern E-commerce - GitHub Readiness Check ==="
echo ""

# Check if we're in a git repository
if [ -d ".git" ]; then
    echo "✅ Git repository detected"
else
    echo "❌ Not a git repository - run 'git init' first"
    exit 1
fi

# Check for required files
echo ""
echo "=== File Verification ==="
required_files=(
    "package.json"
    "src/App.jsx"
    "public/assets/TitanVideo.mp4"
    "public/assets/TitanOffer.png"
    "README.md"
    "DEPLOYMENT.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Check assets directory
echo ""
echo "=== Asset Verification ==="
asset_count=$(find public/assets -type f 2>/dev/null | wc -l)
echo "✅ Found $asset_count assets in public/assets/"

# Verify build works
echo ""
echo "=== Build Verification ==="
if npm run build > /dev/null 2>&1; then
    echo "✅ Production build successful"
    build_size=$(du -sh dist/ 2>/dev/null | cut -f1)
    echo "📦 Build size: $build_size"
else
    echo "❌ Build failed - check for errors"
fi

# Check git status
echo ""
echo "=== Git Status ==="
if git status --porcelain | grep -q .; then
    echo "📝 Uncommitted changes detected:"
    git status --porcelain
    echo ""
    echo "Run these commands to commit and push:"
    echo "  git add ."
    echo "  git commit -m 'feat: complete e-commerce platform with video integration'"
    echo "  git push origin main"
else
    echo "✅ All changes committed"
    echo "🚀 Ready to push to GitHub!"
fi

echo ""
echo "=== Next Steps ==="
echo "1. Push to GitHub: git push origin main"
echo "2. Connect to Vercel and deploy"
echo "3. Verify all assets load correctly on production"
echo "4. Test video autoplay and product functionality"
echo ""
echo "🎉 Your modern e-commerce platform is ready for production!"
