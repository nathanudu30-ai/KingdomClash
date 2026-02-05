#!/bin/bash

# Script pour initialiser et pusher Kingdom Clash sur Git
# Usage: ./git-push.sh

echo "🚀 Kingdom Clash - Git Setup Script"
echo "===================================="
echo ""

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installez Git d'abord."
    exit 1
fi

# Vérifier si on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet kingdom-clash"
    exit 1
fi

echo "✅ Git est installé"
echo ""

# Demander l'URL du repository
read -p "📝 Entrez l'URL de votre repository Git (ex: https://github.com/username/kingdom-clash.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ URL du repository requise"
    exit 1
fi

echo ""
echo "🔧 Configuration de Git..."

# Initialiser Git si pas déjà fait
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git initialisé"
else
    echo "✅ Git déjà initialisé"
fi

# Configurer le remote
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"
echo "✅ Remote 'origin' configuré: $REPO_URL"

# Créer .gitignore s'il n'existe pas
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Production
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Debug
*.log

# Temporary files
tmp/
temp/
EOF
    echo "✅ .gitignore créé"
else
    echo "✅ .gitignore existe déjà"
fi

echo ""
echo "📦 Ajout des fichiers au staging..."
git add .

echo ""
echo "💾 Création du commit initial..."
git commit -m "🎮 Initial commit - Kingdom Clash v0.1.0

✨ Features:
- Next.js 14 avec App Router et TypeScript
- Slot Machine fonctionnel avec animations
- Design system premium avec Tailwind CSS
- 3 options de paris (×1, ×2, ×5)
- 6 symboles avec probabilités pondérées
- Détection automatique des victoires
- Interface responsive mobile-first
- Header avec ressources (Coins, Gems, Spins)
- Navigation bottom
- Configuration Supabase avec migrations SQL
- Types TypeScript complets
- Composants UI réutilisables (Button, Card, ProgressBar)

📚 Documentation:
- README avec Quick Start
- QUICKSTART.md avec guide détaillé
- Roadmap complète sur 24 semaines
- Structure du projet documentée
- Guide d'installation"

echo ""
echo "🌿 Création de la branche main..."
git branch -M main

echo ""
echo "🚀 Push vers le repository distant..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ============================================"
    echo "✅  Succès! Projet pushé sur Git"
    echo "✅ ============================================"
    echo ""
    echo "🔗 Votre repository: $REPO_URL"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "  1. Visitez votre repository sur GitHub/GitLab"
    echo "  2. Configurez les secrets pour CI/CD (si besoin)"
    echo "  3. Invitez vos collaborateurs"
    echo "  4. Commencez à développer! 🎮"
else
    echo ""
    echo "❌ Erreur lors du push. Vérifiez:"
    echo "  - Que le repository existe"
    echo "  - Que vous avez les droits d'écriture"
    echo "  - Votre authentification Git (token/SSH)"
    echo ""
    echo "💡 Pour configurer l'authentification:"
    echo "   GitHub: https://docs.github.com/en/authentication"
    echo "   GitLab: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html"
fi
