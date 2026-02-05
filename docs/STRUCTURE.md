# 📁 Structure du Projet Kingdom Clash

## Architecture globale du repository

Le repository Kingdom Clash est organisé de manière modulaire pour faciliter le développement, la maintenance et la scalabilité du projet. Cette structure sépare clairement les préoccupations entre le frontend, le backend, la documentation et les assets.

## Structure des dossiers

```
kingdom-clash/
├── README.md                          # Documentation principale du projet
├── LICENSE                            # Licence du projet
├── .gitignore                         # Fichiers à ignorer par Git
├── package.json                       # Dépendances Node.js
├── tsconfig.json                      # Configuration TypeScript
├── next.config.js                     # Configuration Next.js
├── tailwind.config.js                 # Configuration Tailwind CSS
│
├── docs/                              # Documentation complète
│   ├── ROADMAP_COMPLETE.md           # Roadmap détaillée
│   ├── INSTALL.md                     # Instructions d'installation
│   ├── CONTRIBUTING.md                # Guide de contribution
│   │
│   ├── roadmap/                       # Détails par phase
│   │   ├── phase-01-02-foundations.md
│   │   ├── phase-03-construction.md
│   │   ├── phase-04-pvp.md
│   │   ├── phase-05-social.md
│   │   ├── phase-06-cards.md
│   │   ├── phase-07-leagues.md
│   │   ├── phase-08-economy.md
│   │   ├── phase-09-events.md
│   │   └── phase-10-polish.md
│   │
│   ├── game-design/                   # Documents de game design
│   │   ├── core-loop.md               # Boucle de gameplay principale
│   │   ├── economy-balance.md         # Balance économique
│   │   ├── progression-curve.md       # Courbe de progression
│   │   ├── pvp-mechanics.md           # Mécaniques PvP
│   │   ├── social-features.md         # Features sociales
│   │   └── monetization-strategy.md   # Stratégie de monétisation
│   │
│   ├── technical/                     # Documentation technique
│   │   ├── architecture.md            # Architecture système
│   │   ├── database-schema.md         # Schéma de base de données
│   │   ├── api-reference.md           # Référence API
│   │   ├── security.md                # Considérations de sécurité
│   │   └── deployment.md              # Guide de déploiement
│   │
│   ├── art/                           # Guidelines artistiques
│   │   ├── style-guide.md             # Guide de style visuel
│   │   ├── color-palette.md           # Palette de couleurs
│   │   ├── typography.md              # Typographie
│   │   ├── animations.md              # Guidelines animations
│   │   └── sound-design.md            # Design sonore
│   │
│   └── marketing/                     # Documentation marketing
│       ├── launch-strategy.md         # Stratégie de lancement
│       ├── user-acquisition.md        # Acquisition utilisateurs
│       ├── app-store-optimization.md  # ASO
│       └── analytics.md               # Tracking analytics
│
├── src/                               # Code source principal
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Layout principal
│   │   ├── page.tsx                   # Page d'accueil
│   │   ├── globals.css                # Styles globaux
│   │   │
│   │   ├── (auth)/                    # Routes d'authentification
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── (game)/                    # Routes du jeu
│   │   │   ├── slot/                  # Machine à sous
│   │   │   ├── district/              # Vue district
│   │   │   ├── attack/                # Interface d'attaque
│   │   │   ├── raid/                  # Mini-jeu de raid
│   │   │   ├── cards/                 # Collection de cartes
│   │   │   ├── guild/                 # Interface de guilde
│   │   │   ├── leaderboard/           # Classements
│   │   │   └── shop/                  # Boutique
│   │   │
│   │   └── api/                       # API Routes
│   │       ├── spin/
│   │       ├── attack/
│   │       ├── raid/
│   │       ├── building/
│   │       └── guild/
│   │
│   ├── components/                    # Composants React
│   │   ├── ui/                        # Composants UI de base
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── game/                      # Composants de jeu
│   │   │   ├── slot-machine.tsx
│   │   │   ├── building-card.tsx
│   │   │   ├── district-view.tsx
│   │   │   ├── attack-modal.tsx
│   │   │   ├── raid-game.tsx
│   │   │   ├── card-collection.tsx
│   │   │   ├── guild-chat.tsx
│   │   │   └── leaderboard.tsx
│   │   │
│   │   └── layout/                    # Composants de layout
│   │       ├── navbar.tsx
│   │       ├── sidebar.tsx
│   │       ├── bottom-nav.tsx
│   │       └── notification-center.tsx
│   │
│   ├── lib/                           # Bibliothèques et utilitaires
│   │   ├── supabase/                  # Configuration Supabase
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   │
│   │   ├── game-logic/                # Logique métier du jeu
│   │   │   ├── slot-engine.ts
│   │   │   ├── matchmaking.ts
│   │   │   ├── economy.ts
│   │   │   ├── progression.ts
│   │   │   └── anti-cheat.ts
│   │   │
│   │   ├── audio/                     # Système audio
│   │   │   ├── sound-manager.ts
│   │   │   └── music-manager.ts
│   │   │
│   │   └── utils/                     # Fonctions utilitaires
│   │       ├── format.ts
│   │       ├── validation.ts
│   │       ├── constants.ts
│   │       └── helpers.ts
│   │
│   ├── hooks/                         # Custom React Hooks
│   │   ├── usePlayer.ts
│   │   ├── useGuild.ts
│   │   ├── useSound.ts
│   │   ├── useNotifications.ts
│   │   └── useAnalytics.ts
│   │
│   ├── types/                         # Types TypeScript
│   │   ├── player.ts
│   │   ├── district.ts
│   │   ├── guild.ts
│   │   ├── card.ts
│   │   ├── attack.ts
│   │   └── index.ts
│   │
│   └── styles/                        # Styles additionnels
│       ├── animations.css
│       └── themes.css
│
├── public/                            # Assets statiques
│   ├── images/                        # Images
│   │   ├── districts/                 # Backgrounds de districts
│   │   ├── buildings/                 # Sprites de bâtiments
│   │   ├── cards/                     # Images de cartes
│   │   ├── avatars/                   # Avatars
│   │   ├── icons/                     # Icônes
│   │   └── ui/                        # Éléments UI
│   │
│   ├── sounds/                        # Fichiers audio
│   │   ├── ui/                        # Sons d'interface
│   │   ├── slot/                      # Sons du slot machine
│   │   ├── combat/                    # Sons de combat
│   │   ├── construction/              # Sons de construction
│   │   └── ambient/                   # Musiques d'ambiance
│   │
│   ├── fonts/                         # Polices personnalisées
│   │   ├── Poppins/
│   │   └── Inter/
│   │
│   └── favicon.ico
│
├── supabase/                          # Configuration Supabase
│   ├── migrations/                    # Migrations de base de données
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_guilds.sql
│   │   ├── 003_add_cards.sql
│   │   └── ...
│   │
│   ├── functions/                     # Edge Functions
│   │   ├── spin/
│   │   ├── attack/
│   │   ├── raid/
│   │   └── guild/
│   │
│   └── seed.sql                       # Données de test
│
├── scripts/                           # Scripts utilitaires
│   ├── generate-districts.js         # Générer des districts
│   ├── balance-economy.js             # Tester la balance économique
│   ├── seed-database.js               # Seeder la base de données
│   └── export-analytics.js            # Exporter les analytics
│
└── tests/                             # Tests
    ├── unit/                          # Tests unitaires
    ├── integration/                   # Tests d'intégration
    └── e2e/                           # Tests end-to-end
```

## Conventions de nommage

Les fichiers et dossiers suivent des conventions strictes pour maintenir la cohérence du projet. Les composants React utilisent PascalCase (SlotMachine.tsx, BuildingCard.tsx). Les fichiers utilitaires et hooks utilisent camelCase (usePlayer.ts, formatCurrency.ts). Les dossiers utilisent kebab-case (game-logic/, slot-machine/). Les constantes sont en SCREAMING_SNAKE_CASE dans le code.

## Organisation du code

Le code est organisé selon le principe de séparation des préoccupations. Les composants UI purs sont dans components/ui et ne contiennent aucune logique métier. La logique de jeu est centralisée dans lib/game-logic et est testable indépendamment de l'UI. Les appels API sont gérés par des hooks personnalisés qui encapsulent la logique de fetching et de caching. Les types TypeScript sont définis dans types/ et partagés dans toute l'application.

## Gestion des assets

Les assets sont organisés par catégorie dans public/. Les images utilisent le format WebP pour minimiser la taille. Les sons sont compressés en MP3 128kbps. Les fonts sont subsettées pour inclure uniquement les caractères nécessaires. Un système de lazy loading charge les assets à la demande pour optimiser les performances.

## Base de données

Les migrations Supabase sont versionnées chronologiquement dans supabase/migrations/. Chaque migration est atomique et peut être rollbackée. Les Edge Functions sont déployées dans supabase/functions/ et gèrent la logique serveur critique comme la génération de résultats de spin et la validation des attaques PvP.

## Documentation

La documentation est exhaustive et maintenue à jour. Chaque phase de développement possède sa propre documentation détaillée. Les documents de game design expliquent les mécaniques et la balance. La documentation technique couvre l'architecture et le déploiement. Les guidelines artistiques assurent la cohérence visuelle et sonore.

## Tests

Les tests sont organisés par type. Les tests unitaires vérifient les fonctions individuelles et les composants isolés. Les tests d'intégration valident les interactions entre systèmes. Les tests end-to-end simulent des parcours utilisateurs complets. Un coverage de 80% minimum est visé pour le code critique.

Cette structure modulaire facilite la collaboration, simplifie la maintenance et permet une scalabilité à long terme du projet Kingdom Clash.
