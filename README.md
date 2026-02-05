# Kingdom Clash - Jeu Mobile Social

## Vue d'ensemble

Kingdom Clash est un jeu mobile social moderne combinant l'excitation d'une machine a sous avec la construction urbaine strategique et le PvP competitif. Les joueurs construisent leur empire quartier par quartier, attaquent les bases de leurs rivaux, forment des alliances dans des guildes puissantes, et dominent les classements mondiaux.

## Concept Core

Le jeu s'inspire de Coin Master mais apporte des innovations majeures pour creer une experience unique et moderne :

**Piliers du gameplay :**
- Machine a sous addictive avec mecaniques innovantes
- Construction de districts urbains avec 4 batiments evolutifs (style 2D illustre)
- Systeme PvP actif avec attaques, raids et revanches
- Guildes sociales avec chat temps reel, dons et guerres
- Collection de cartes thematiques avec systeme de trading
- Competition infinie via ligues, saisons et tournois

**Univers :** Monde urbain moderne ou le joueur batit son empire de quartier en quartier, du simple coin de rue jusqu'aux gratte-ciels futuristes.

## Stack Technique

**Frontend (Mobile natif)**
- React Native + Expo
- TypeScript
- React Native Reanimated (animations)
- Lottie (animations pre-rendues)
- expo-av (systeme audio)
- expo-haptics (vibrations)
- i18next + react-i18next (i18n)

**Backend**
- Supabase (auth, database, realtime)
- PostgreSQL avec Row Level Security
- Edge Functions (logique serveur, validation anti-triche)
- Storage (avatars, assets)

**Services**
- IAP natifs (StoreKit 2 / Google Play Billing)
- PostHog (analytics)
- Sentry (monitoring)
- OneSignal (notifications push)

**Deploiement**
- App Store (iOS)
- Google Play Store (Android)

## Timeline de Developpement

**Duree totale : 24 semaines (6 mois) jusqu'au soft launch**

### Phase 1-2 : Fondations + Slot Machine (Semaines 1-5)
Setup React Native + Expo, design system, authentification (email, OAuth, guest), profil joueur, et slot machine avec animations fluides et auto-spin.

### Phase 3 : Construction Urbaine (Semaines 6-8)
Systeme de districts avec 4 batiments evolutifs, 15-20 districts au lancement en 2D illustre, systeme de niveaux (niveau = districts completes), et inventaire.

### Phase 4 : Systeme PvP (Semaines 9-11)
Matchmaking intelligent, attaques et raids, revenge, mini-jeu de raid, et systeme anti-triche (validation 100% serveur-side).

### Phase 5 : Social & Guildes (Semaines 12-14)
Systeme d'amis, guildes avec chat temps reel modere, dons, boss raids cooperatifs, et guerres de guildes.

### Phase 6 : Collection de Cartes (Semaines 15-16)
Sets de cartes thematiques, systeme d'obtention, et trading entre amis.

### Phase 7 : Ligues & Competition (Semaines 17-18)
Ligues a 5 tiers, saisons competitives de 30 jours, et leaderboards multiples.

### Phase 8 : Economie & Monetisation (Semaine 19)
Balance economique, boutique in-app, gems, VIP Pass, et integration IAP natifs (Apple/Google).

### Phase 9 : Events & Retention (Semaine 20)
Events rotatifs, quetes quotidiennes, achievements, battle pass, et notifications push.

### Phase 10 : Polish & Launch (Semaines 21-24)
Tutorial FTUE, i18n (5 langues), accessibilite, conformite legale (RGPD, CGU), infrastructure (backups, monitoring), support client, testing, et soft launch.

## Documentation

Toute la documentation detaillee se trouve dans le dossier `/docs` :

- [Roadmap complete](./docs/ROADMAP_COMPLETE.md) - Plan detaille des 24 semaines (v2.0 FINALE)

## Quick Start

### Installation

```bash
# 1. Installer les dependances
npm install

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Configurer vos variables Supabase dans .env
# EXPO_PUBLIC_SUPABASE_URL=votre_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle

# 4. Lancer le serveur de developpement Expo
npx expo start
```

### Configuration Supabase

1. Creez un compte sur [supabase.com](https://supabase.com)
2. Creez un nouveau projet
3. Executez les migrations SQL dans `supabase/migrations/`
4. Copiez votre URL et cle anonyme dans `.env`

## Licence

Tous droits reserves (c) 2026

---

**Statut actuel :** Phase de planification terminee, pret pour le code
**Version :** 0.2.0
**Derniere mise a jour :** Fevrier 2026
