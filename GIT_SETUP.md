# 🔧 Guide: Mettre Kingdom Clash sur Git

## Option 1: Script automatique (Recommandé)

### Sur Linux/Mac:

```bash
# 1. Extraire l'archive
tar -xzf kingdom-clash-setup.tar.gz
cd kingdom-clash

# 2. Rendre le script exécutable
chmod +x git-push.sh

# 3. Exécuter le script
./git-push.sh
```

Le script vous demandera l'URL de votre repository et fera tout automatiquement.

### Sur Windows (Git Bash):

```bash
# 1. Extraire l'archive avec 7-Zip ou WinRAR
cd kingdom-clash

# 2. Exécuter le script
bash git-push.sh
```

---

## Option 2: Commandes manuelles

### Étape 1: Créer un repository sur GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur le **+** en haut à droite → **New repository**
3. Nommez-le: `kingdom-clash`
4. **NE PAS** initialiser avec README, .gitignore, ou licence (déjà présents)
5. Cliquez sur **Create repository**
6. **Copiez l'URL** du repository (ex: `https://github.com/votre-username/kingdom-clash.git`)

### Étape 2: Préparer le projet localement

```bash
# 1. Extraire l'archive
tar -xzf kingdom-clash-setup.tar.gz
cd kingdom-clash

# 2. Vérifier que .gitignore existe
cat .gitignore
```

Si `.gitignore` n'existe pas, créez-le:

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Temporary
tmp/
temp/
EOF
```

### Étape 3: Initialiser Git et pusher

```bash
# 1. Initialiser Git (si pas déjà fait)
git init

# 2. Ajouter le remote (remplacez par VOTRE URL)
git remote add origin https://github.com/VOTRE-USERNAME/kingdom-clash.git

# 3. Ajouter tous les fichiers
git add .

# 4. Faire le commit initial
git commit -m "🎮 Initial commit - Kingdom Clash v0.1.0

✨ Features:
- Slot Machine fonctionnel avec animations
- Next.js 14 + TypeScript + Tailwind CSS
- Design system premium
- Configuration Supabase
- Documentation complète"

# 5. Renommer la branche en main
git branch -M main

# 6. Pusher vers GitHub
git push -u origin main
```

### Étape 4: Vérification

1. Allez sur votre repository GitHub
2. Vous devriez voir tous les fichiers
3. Le README.md s'affichera automatiquement

---

## 🔐 Authentification Git

### Avec HTTPS (Token recommandé)

Si Git vous demande un mot de passe:

1. Allez dans **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Cliquez sur **Generate new token (classic)**
3. Donnez un nom (ex: "kingdom-clash-dev")
4. Sélectionnez les scopes: `repo` (tous les sous-scopes)
5. Cliquez sur **Generate token**
6. **COPIEZ le token** (vous ne le reverrez plus!)
7. Lors du push, utilisez le **token comme mot de passe**

### Avec SSH (Avancé)

```bash
# 1. Générer une clé SSH (si vous n'en avez pas)
ssh-keygen -t ed25519 -C "votre-email@example.com"

# 2. Copier la clé publique
cat ~/.ssh/id_ed25519.pub

# 3. Ajouter sur GitHub: Settings → SSH keys → New SSH key

# 4. Utiliser l'URL SSH au lieu de HTTPS
git remote set-url origin git@github.com:VOTRE-USERNAME/kingdom-clash.git
```

---

## ❌ Problèmes courants

### "Permission denied"
→ Vérifiez votre token ou configurez SSH
→ Assurez-vous d'avoir les droits sur le repository

### "Repository not found"
→ Vérifiez que l'URL est correcte
→ Le repository doit exister sur GitHub

### "Already exists"
→ Le dossier .git existe déjà
→ Supprimez-le: `rm -rf .git` puis recommencez

### "Failed to push"
→ Le repository n'est pas vide
→ Utilisez `git push -f origin main` (⚠️ écrase le contenu distant)

---

## 📋 Après le premier push

### Cloner sur une autre machine

```bash
git clone https://github.com/VOTRE-USERNAME/kingdom-clash.git
cd kingdom-clash
npm install
cp .env.local.example .env.local
# Configurer .env.local avec vos clés Supabase
npm run dev
```

### Workflow de développement

```bash
# 1. Créer une branche pour une feature
git checkout -b feature/audio-system

# 2. Faire vos modifications
# ... développement ...

# 3. Commit régulièrement
git add .
git commit -m "✨ Add audio system with Howler.js"

# 4. Pusher la branche
git push origin feature/audio-system

# 5. Créer une Pull Request sur GitHub
# 6. Merger après review
# 7. Retour sur main et pull
git checkout main
git pull origin main
```

### Commandes utiles

```bash
# Voir le status
git status

# Voir l'historique
git log --oneline

# Voir les branches
git branch -a

# Annuler les modifications non commitées
git restore .

# Voir les différences
git diff
```

---

## 🎯 Structure Git recommandée

```
main (production)
├── develop (développement)
│   ├── feature/slot-animations
│   ├── feature/audio-system
│   ├── feature/supabase-integration
│   └── feature/auto-spin
└── hotfix/critical-bug
```

---

## 📚 Ressources

- [Documentation Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Bon push! 🚀**
