# 🚀 Installation et Configuration de Kingdom Clash

Ce guide vous accompagne à travers toutes les étapes nécessaires pour installer et configurer l'environnement de développement de Kingdom Clash.

## Prérequis système

Avant de commencer, assurez-vous que votre système dispose des éléments suivants installés et configurés correctement.

Vous aurez besoin de Node.js version 18.0.0 ou supérieure, disponible sur nodejs.org. npm version 9.0.0 ou supérieure est également requis (inclus avec Node.js). Un éditeur de code moderne tel que Visual Studio Code est recommandé. Enfin, Git doit être installé pour la gestion de version.

Un compte Supabase gratuit est nécessaire pour la base de données et l'authentification. Vous pouvez créer un compte sur supabase.com. Pour les tests de paiement en développement, un compte Stripe en mode test sera également utile.

## Installation initiale

Commencez par cloner le repository Git sur votre machine locale en utilisant la commande suivante dans votre terminal. Une fois le repository cloné, naviguez dans le dossier du projet et installez toutes les dépendances Node.js nécessaires avec npm install. Cette commande téléchargera et configurera tous les packages listés dans le fichier package.json.

```bash
git clone https://github.com/votre-username/kingdom-clash.git
cd kingdom-clash
npm install
```

## Configuration de Supabase

La configuration de Supabase est essentielle pour que l'application puisse fonctionner correctement, car elle gère l'authentification, la base de données et le stockage.

Connectez-vous à votre tableau de bord Supabase et créez un nouveau projet. Choisissez un nom pour votre projet, définissez un mot de passe pour la base de données, et sélectionnez la région la plus proche de votre localisation pour minimiser la latence.

Une fois le projet créé, accédez aux paramètres du projet pour obtenir vos clés API. Vous trouverez l'URL de votre projet ainsi que la clé API anonyme dans la section API Settings. Ces informations sont cruciales pour connecter votre application frontend à Supabase.

Créez un fichier nommé .env.local à la racine du projet et ajoutez-y vos variables d'environnement Supabase. Le fichier doit contenir NEXT_PUBLIC_SUPABASE_URL avec l'URL de votre projet, et NEXT_PUBLIC_SUPABASE_ANON_KEY avec votre clé anonyme.

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme
```

## Initialisation de la base de données

La structure de la base de données doit être créée avant de pouvoir utiliser l'application. Les migrations SQL se trouvent dans le dossier supabase/migrations et doivent être exécutées dans l'ordre chronologique.

Ouvrez l'éditeur SQL dans votre tableau de bord Supabase et exécutez chaque fichier de migration un par un, en commençant par 001_initial_schema.sql. Ce fichier crée les tables principales telles que players, districts, guilds, et configure les politiques de sécurité Row Level Security.

Continuez avec les migrations suivantes dans l'ordre numérique. La migration 002_add_guilds.sql ajoute les fonctionnalités de guildes, 003_add_cards.sql implémente le système de collection de cartes, et ainsi de suite. Chaque migration construit sur la précédente, il est donc crucial de les exécuter séquentiellement.

Pour peupler la base de données avec des données de test, exécutez également le fichier seed.sql qui créera quelques joueurs, districts et guildes de démonstration. Ces données facilitent le développement et les tests sans avoir à créer manuellement du contenu.

## Configuration des Edge Functions

Les Edge Functions Supabase gèrent la logique serveur critique comme la génération de résultats de slot machine et la validation des actions PvP. Ces fonctions doivent être déployées séparément.

Installez la CLI Supabase globalement sur votre système avec npm install -g supabase. Une fois installée, connectez-vous à votre projet avec supabase login et suivez les instructions d'authentification.

Déployez toutes les Edge Functions en une seule commande depuis le dossier racine du projet. La CLI détectera automatiquement les fonctions dans le dossier supabase/functions et les déploiera sur votre projet Supabase.

```bash
supabase functions deploy
```

## Lancement du serveur de développement

Une fois toutes les configurations terminées, vous êtes prêt à lancer l'application en mode développement. Exécutez la commande npm run dev depuis la racine du projet. Cette commande démarre le serveur Next.js en mode développement avec hot reload, ce qui signifie que toute modification du code sera immédiatement reflétée dans le navigateur.

Ouvrez votre navigateur et naviguez vers http://localhost:3000 pour voir l'application en action. Le serveur de développement compile automatiquement les fichiers TypeScript et applique le hot module replacement pour une expérience de développement fluide.

## Configuration de l'environnement de production

Lorsque vous êtes prêt à déployer l'application en production, plusieurs étapes supplémentaires sont nécessaires pour optimiser les performances et la sécurité.

Construisez l'application pour la production avec npm run build. Cette commande génère une version optimisée de l'application dans le dossier .next, avec du code minifié, des bundles optimisés, et des images compressées.

Pour l'hébergement, Vercel est la plateforme recommandée car elle offre une intégration native avec Next.js. Connectez votre repository GitHub à Vercel, et la plateforme déploiera automatiquement chaque push sur la branche main. Configurez les variables d'environnement de production dans les paramètres du projet Vercel.

Assurez-vous de configurer des variables d'environnement différentes pour la production. La base de données de production doit être séparée de celle de développement pour éviter toute corruption de données pendant les tests. Créez un projet Supabase dédié pour la production avec ses propres clés API.

## Outils de développement recommandés

Plusieurs extensions Visual Studio Code amélioreront significativement votre expérience de développement. L'extension ES7+ React/Redux/React-Native snippets fournit des raccourcis pour créer rapidement des composants React. Prettier - Code formatter assure un formatage cohérent du code. ESLint intègre le linting directement dans l'éditeur. Tailwind CSS IntelliSense offre l'autocomplétion pour les classes Tailwind.

Pour le debugging, les React Developer Tools et Redux DevTools sont essentiels pour inspecter les composants et l'état de l'application. PostHog (analytics) peut être configuré en développement pour tester le tracking d'événements sans affecter les données de production.

## Résolution des problèmes courants

Si vous rencontrez des erreurs durant l'installation ou le développement, plusieurs solutions sont disponibles. Une erreur de connexion à Supabase indique généralement que les variables d'environnement ne sont pas correctement configurées. Vérifiez que le fichier .env.local existe et contient les bonnes valeurs.

Des erreurs de compilation TypeScript peuvent survenir si les types ne sont pas à jour. Exécutez npm run type-check pour identifier les problèmes de typage. Assurez-vous également que tous les packages sont installés avec les bonnes versions en supprimant node_modules et en réinstallant avec npm install.

Si le serveur de développement refuse de démarrer, vérifiez qu'aucun autre processus n'utilise le port 3000. Vous pouvez changer le port en lançant le serveur avec PORT=3001 npm run dev. Pour des problèmes de performance, désactivez temporairement les extensions de navigateur qui pourraient interférer avec React DevTools.

## Support et ressources

Pour toute question ou problème non couvert par ce guide, plusieurs ressources sont disponibles. La documentation officielle de Next.js sur nextjs.org couvre tous les aspects du framework. La documentation Supabase sur supabase.com/docs explique en détail l'utilisation de la base de données et des fonctionnalités backend.

Le repository GitHub du projet contient une section Issues où vous pouvez signaler des bugs ou demander de l'aide. Pour des discussions plus générales sur le développement du jeu, rejoignez le serveur Discord de la communauté où les développeurs partagent leurs expériences et s'entraident.

---

Vous êtes maintenant prêt à commencer le développement de Kingdom Clash. Le prochain document à consulter est STRUCTURE.md pour comprendre l'organisation du code et savoir où placer vos nouvelles fonctionnalités.
