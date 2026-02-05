# 🎯 Guide de Démarrage Rapide - Kingdom Clash

## ✅ Ce qui a été créé

### Structure Next.js 14 complète
- ✅ App Router configuré
- ✅ TypeScript avec configuration stricte
- ✅ Tailwind CSS avec design system personnalisé
- ✅ Composants UI de base (Button, Card, ProgressBar)
- ✅ Layout responsive avec Header et BottomNav

### Slot Machine fonctionnel
- ✅ 3 rouleaux avec 6 symboles (💰⚔️🎯🛡️⚡🌟)
- ✅ 3 options de paris (×1, ×2, ×5)
- ✅ Animations fluides pendant le spin
- ✅ Détection des victoires (2 ou 3 symboles identiques)
- ✅ Logique de génération avec poids probabilistes
- ✅ Calcul automatique des récompenses

### Base de données Supabase
- ✅ Migration SQL complète pour la table `players`
- ✅ Table `player_stats` pour les statistiques
- ✅ Table `spin_history` pour l'historique des spins
- ✅ Row Level Security activé
- ✅ Triggers automatiques pour les timestamps

### Types TypeScript
- ✅ Types pour Player, District, Slot
- ✅ Interfaces pour les résultats de spin
- ✅ Constantes du jeu bien définies

## 🚀 Étapes pour lancer le projet

### 1. Installer les dépendances

```bash
cd kingdom-clash
npm install
```

Cette commande installera toutes les dépendances listées dans `package.json`.

### 2. Configurer Supabase

#### Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte (gratuit)
3. Cliquez sur "New Project"
4. Donnez un nom à votre projet (ex: "kingdom-clash-dev")
5. Choisissez un mot de passe fort pour la base de données
6. Sélectionnez la région la plus proche (ex: Europe West pour la France)
7. Attendez que le projet soit créé (~2 minutes)

#### Récupérer les clés API
1. Une fois le projet créé, allez dans "Settings" → "API"
2. Copiez l'URL du projet (Project URL)
3. Copiez la clé anonyme (anon/public key)

#### Exécuter la migration SQL
1. Dans votre dashboard Supabase, allez dans "SQL Editor"
2. Cliquez sur "New query"
3. Copiez tout le contenu de `supabase/migrations/001_initial_schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur "Run" (en bas à droite)
6. Vérifiez qu'il n'y a pas d'erreurs

#### Configurer les variables d'environnement
1. À la racine du projet, créez un fichier `.env.local`
2. Ajoutez vos clés Supabase :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme_ici
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎮 Tester le prototype

### Ce que vous devriez voir
- Une interface moderne avec fond navy foncé
- Un header avec avatar, niveau, et ressources (Coins, Gems, Spins)
- Un titre "DOWNTOWN DISTRICT" avec effet de gradient animé
- Une barre de progression des bâtiments
- La machine à sous avec 3 rouleaux
- 3 options de paris (×1, ×2, ×5)
- Un bouton "SPIN" orange
- Une navigation bottom avec 5 icônes

### Fonctionnalités testables
1. **Cliquez sur SPIN** - Les rouleaux tournent pendant ~2 secondes
2. **Victoires** - Si 2 ou 3 symboles identiques, les rouleaux gagnants brillent en vert
3. **Compteur de coins** - Augmente automatiquement quand vous gagnez
4. **Compteur de spins** - Diminue à chaque spin
5. **Options de paris** - Cliquez sur ×2 ou ×5 pour changer (coûte plus de spins mais rapporte plus)

### Console du navigateur
Ouvrez la console (F12) pour voir les logs :
- Résultats de chaque spin
- Détails des victoires (small, big, jackpot)
- Coins gagnés

## 📋 Prochaines étapes (Semaine 1)

### Priorités immédiates

1. **Système audio** (2-3 heures)
   - Intégrer Howler.js
   - Ajouter sons pour : spin start, reel stop, win, lose
   - Créer un SoundManager réutilisable

2. **Animations avancées** (3-4 heures)
   - Particules de coins lors des victoires
   - Animation de célébration pour jackpot
   - Effet de "bounce" plus prononcé sur les rouleaux

3. **Auto-spin** (1-2 heures)
   - Boutons pour auto-spin ×10, ×50, ×100
   - Stop automatique si plus de spins
   - Bouton Stop pour arrêter manuellement

4. **Rechargement des spins** (2-3 heures)
   - Timer visible montrant le temps jusqu'au prochain spin
   - Rechargement automatique (1 spin / 30 min)
   - Notification quand l'énergie est pleine

5. **Intégration Supabase réelle** (4-5 heures)
   - Connecter le SlotMachine à la vraie DB
   - Sauvegarder chaque spin dans `spin_history`
   - Mettre à jour les ressources du joueur en temps réel
   - Gérer l'authentification basique

## 🐛 Problèmes courants

### "Cannot find module '@/...'"
→ Vérifiez que `tsconfig.json` a bien le `paths` configuré
→ Redémarrez le serveur (`Ctrl+C` puis `npm run dev`)

### "Module not found: Can't resolve 'tailwindcss-animate'"
→ Exécutez `npm install tailwindcss-animate`

### "Supabase environment variables are not set"
→ Créez le fichier `.env.local` avec vos clés
→ Redémarrez le serveur après avoir créé le fichier

### Les animations sont saccadées
→ Désactivez les extensions de navigateur
→ Testez dans un navigateur différent
→ Vérifiez que vous n'avez pas 50 onglets ouverts

### La base de données ne se connecte pas
→ Vérifiez que l'URL et la clé sont correctes
→ Vérifiez que la migration SQL a bien été exécutée
→ Testez la connexion dans l'onglet "Table Editor" de Supabase

## 💡 Conseils de développement

1. **Gardez le serveur de dev toujours allumé** - Le hot reload est votre ami
2. **Ouvrez la console du navigateur** - Les erreurs y sont affichées clairement
3. **Testez sur mobile** - Utilisez le mode responsive de Chrome (F12 → icône mobile)
4. **Commitez souvent** - Faites des petits commits après chaque feature qui marche
5. **Lisez les types** - Survolez les variables dans VS Code pour voir leurs types

## 📚 Ressources utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)

## ✨ Features bonus (si temps disponible)

- Ajouter des sons temporaires (même basiques)
- Créer des effets de particules simples avec CSS
- Ajouter une modal pour afficher les règles du jeu
- Créer une page Settings pour ajuster le volume
- Implémenter le système de daily bonus

---

**Bonne chance pour la suite du développement! 🚀**

En cas de problème, consultez `INSTALL.md` pour plus de détails, ou la documentation officielle des technologies utilisées.
