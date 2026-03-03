# Push to GitHub - run from this folder (right-click -> Run with PowerShell)
Set-Location $PSScriptRoot

# Remove existing origin if any
git remote remove origin 2>$null

# Add remote
git remote add origin https://github.com/DiasIsenov06/ai-english-analyzer.git

# Ensure main branch
git branch -M main

# Push
git push -u origin main
