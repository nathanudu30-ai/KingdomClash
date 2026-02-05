# 📝 TODO - Prochaines Étapes

## Statut actuel du projet

Le projet Kingdom Clash a été initialisé avec succès. La structure complète du repository a été créée, incluant une roadmap détaillée de 24 semaines, la documentation technique, et la configuration initiale.

## Prochaines actions immédiates

### 1. Configuration de l'environnement de développement
- Créer un compte Supabase et initialiser un projet
- Configurer les variables d'environnement dans .env.local
- Installer les dépendances Node.js avec npm install
- Vérifier que le serveur de développement démarre correctement

### 2. Mise en place de la base de données
- Créer les migrations SQL initiales dans supabase/migrations/
- Définir le schéma de la table players (id, username, email, coins, spins, level, etc.)
- Configurer Row Level Security pour protéger les données des joueurs
- Créer les tables de base : players, districts, spin_history

### 3. Développement du slot machine (Phase 1-2)
- Créer le composant SlotMachine.tsx avec trois rouleaux
- Implémenter la logique de génération aléatoire des symboles côté serveur
- Développer les animations de spin avec GSAP
- Intégrer le système audio avec Howler.js
- Créer l'interface de gestion des spins et de l'énergie

### 4. Design system de base
- Définir les couleurs principales (bleu électrique, orange, navy)
- Créer les composants UI de base : Button, Card, Modal, ProgressBar
- Implémenter les animations avec Framer Motion
- Configurer Tailwind CSS avec la palette personnalisée

## Priorités pour la semaine 1

L'objectif de la première semaine est d'avoir un prototype fonctionnel minimal du slot machine. Ce prototype permettra de valider les mécaniques de base et de tester l'addiction du gameplay avant d'investir dans des features plus complexes.

La priorité absolue est la création du slot machine avec animations satisfaisantes. Un slot qui donne du plaisir à jouer est la fondation de tout le reste du jeu. Le feedback visuel et audio doit être immédiat et gratifiant.

## Notes importantes

Le développement doit suivre l'approche itérative décrite dans la roadmap. Chaque feature doit être testée individuellement avant de passer à la suivante. Les performances doivent être surveillées dès le début pour éviter les problèmes d'optimisation plus tard.

La documentation doit être maintenue à jour au fur et à mesure du développement. Chaque décision technique importante doit être documentée pour faciliter la maintenance future.

## Ressources nécessaires

Pour commencer le développement, vous aurez besoin des assets suivants :
- Sons du slot machine (spin start, reel stop, win sounds)
- Sprites des symboles (coins, attack, raid, shield, energy, wildcard)
- Backgrounds temporaires pour l'interface
- Icônes UI de base

Ces assets peuvent être créés de manière basique au début et améliorés progressivement pendant le polish en Phase 10.

---

**Dernière mise à jour :** Février 2026
**Prochain milestone :** Prototype du slot machine fonctionnel
