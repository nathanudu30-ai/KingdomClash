# 🎮 Kingdom Clash - Jeu Mobile Social

## Vue d'ensemble

Kingdom Clash est un jeu mobile social moderne combinant l'excitation d'une machine à sous avec la construction urbaine stratégique et le PvP compétitif. Les joueurs construisent leur empire quartier par quartier, attaquent les bases de leurs rivaux, forment des alliances dans des guildes puissantes, et dominent les classements mondiaux.

## Concept Core

Le jeu s'inspire de Coin Master mais apporte des innovations majeures pour créer une expérience unique et moderne :

**Piliers du gameplay :**
- Machine à sous addictive avec mécaniques innovantes
- Construction de districts urbains avec 4 bâtiments évolutifs
- Système PvP actif avec attaques, raids et revanches
- Guildes sociales avec chat temps réel, dons et guerres
- Collection de cartes thématiques avec système de trading
- Compétition infinie via ligues, saisons et tournois

**Univers :** Monde urbain moderne où le joueur bâtit son empire de quartier en quartier, du simple coin de rue jusqu'aux gratte-ciels futuristes.

## Stack Technique

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Three.js (rendu 3D des bâtiments)
- Howler.js (système audio)

**Backend**
- Supabase (auth, database, realtime)
- PostgreSQL avec Row Level Security
- Edge Functions (logique serveur)
- Storage (avatars, assets)

**Services**
- Stripe (paiements)
- PostHog (analytics)
- Sentry (monitoring)
- OneSignal (notifications push)

## Timeline de Développement

**Durée totale : 24 semaines (6 mois) jusqu'au soft launch**

### Phase 1-2 : Fondations + Slot Machine (Semaines 1-5)
Mise en place de l'architecture technique, design system, et développement de la mécanique centrale du slot machine avec animations fluides et système d'auto-spin.

### Phase 3 : Construction Urbaine (Semaines 6-8)
Développement du système de districts avec 4 bâtiments évolutifs, thématiques variées, et animations de construction en 3D.

### Phase 4 : Système PvP (Semaines 9-11)
Implementation du matchmaking intelligent, système d'attaques et raids, mécaniques de revenge, et mini-jeu de raid.

### Phase 5 : Social & Guildes (Semaines 12-14)
Création du système de guildes complet avec chat temps réel, dons entre membres, boss raids coopératifs, et guerres de guildes.

### Phase 6 : Collection de Cartes (Semaines 15-16)
Développement des sets de cartes thématiques, système d'obtention, et trading entre joueurs.

### Phase 7 : Ligues & Compétition (Semaines 17-18)
Implementation des ligues à 5 tiers, saisons compétitives de 30 jours, et leaderboards multiples.

### Phase 8 : Économie & Monétisation (Semaine 19)
Balance de l'économie du jeu, création de la boutique in-app, système de gems, et integration des paiements.

### Phase 9 : Events & Rétention (Semaine 20)
Développement des events rotatifs, quêtes quotidiennes, achievements, et système de notifications push.

### Phase 10 : Polish & Launch (Semaines 21-24)
Tutorial FTUE, optimisations de performance, testing complet, et préparation du soft launch.

## Structure du Repository

Consultez le fichier `STRUCTURE.md` pour comprendre l'organisation complète du code et des assets.

## Documentation

Toute la documentation détaillée se trouve dans le dossier `/docs` :

- `roadmap/` : Roadmap détaillée par phase
- `game-design/` : Documents de game design
- `technical/` : Documentation technique
- `art/` : Guidelines artistiques
- `marketing/` : Stratégie marketing

## 🚀 Quick Start

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.local.example .env.local

# 3. Configurer vos variables Supabase dans .env.local
# NEXT_PUBLIC_SUPABASE_URL=votre_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé

# 4. Lancer le serveur de développement
npm run dev
```

Le jeu sera accessible sur [http://localhost:3000](http://localhost:3000)

### Configuration Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Exécutez la migration SQL dans `supabase/migrations/001_initial_schema.sql`
4. Copiez votre URL et clé anonyme dans `.env.local`

### Fonctionnalités actuelles (v0.1.0)

✅ **Slot Machine fonctionnel** avec animations fluides
✅ **Design system complet** avec Tailwind CSS
✅ **3 options de paris** (×1, ×2, ×5)
✅ **Système de rouleaux** avec 6 symboles
✅ **Détection des victoires** (2 ou 3 symboles identiques)
✅ **Interface responsive** mobile-first
✅ **Header avec ressources** (Coins, Gems, Spins)
✅ **Navigation bottom** pour futures pages
✅ **Base de données SQL** avec Row Level Security

### Prochaines étapes

Consultez `TODO.md` pour voir les prochaines fonctionnalités à développer.

## Licence

Tous droits réservés © 2026

---

**Statut actuel :** Phase de planification et setup initial
**Version :** 0.1.0
**Dernière mise à jour :** Février 2026
