# Assets visuels du jeu

Ce dossier centralise les médias locaux du jeu pour simplifier les imports React Native (`require(...)`).

## Structure

- `backgrounds/` : fonds d'écran (home, écran slot, etc.)
- `slot-machine/` : éléments de la machine à sous (frame, levier, bouton spin, décor)
- `tokens/` : jetons/monnaies (bronze, argent, or, premium)

## Convention de nommage

Utilise des noms explicites en `kebab-case` :

- `bg-slot-city-night.webp`
- `machine-frame-neon.webp`
- `token-gold.webp`

## Note React Native

Pour pouvoir importer localement dans l'app Expo/React Native, garde des imports statiques:

```ts
const image = require('../../assets/backgrounds/bg-slot-city-night.webp');
```

Évite les chemins dynamiques dans `require()`.
