# Kingdom Clash

**Jeu mobile PvP - Clash de royaumes en temps reel**

## Concept

Kingdom Clash est un jeu mobile PvP ou les joueurs construisent leur royaume, collectent des ressources via une slot machine strategique, et affrontent d'autres joueurs dans des batailles en temps reel.

### Mecaniques principales

- **Slot Machine strategique** : Systeme de roulettes avec ressources (or, bois, pierre, nourriture), attaques, boucliers et evenements speciaux
- **Construction de royaume** : Batiments defensifs et offensifs a ameliorer
- **Combat PvP** : Attaques entre joueurs avec systeme de classement
- **Systeme de bouclier** : Protection temporaire contre les attaques
- **Evenements speciaux** : Bonus, raids, et evenements saisonniers

## Stack Technique

| Composant | Technologie |
|-----------|------------|
| Frontend Mobile | React Native + Expo |
| Backend | Node.js + Express |
| Base de donnees | MongoDB (Mongoose) |
| Temps reel | Socket.IO |
| Authentification | JWT + bcrypt |
| State Management | Redux Toolkit |
| Animations | React Native Animated / Lottie |
| Tests | Jest + React Native Testing Library |

## Timeline

Le developpement est organise en **6 phases sur 24 semaines** :

| Phase | Semaines | Description |
|-------|----------|-------------|
| Phase 1 | 1-4 | Setup technique + Slot Machine |
| Phase 2 | 5-8 | Systeme de royaume et ressources |
| Phase 3 | 9-12 | Combat PvP et classement |
| Phase 4 | 13-16 | Social, clans et chat |
| Phase 5 | 17-20 | Polish, animations et monetisation |
| Phase 6 | 21-24 | Tests, optimisation et lancement |

## Documentation

- [Roadmap complete](./ROADMAP_COMPLETE.md) - Plan detaille des 24 semaines
- [Structure du projet](./STRUCTURE.md) - Organisation du code
- [Guide d'installation](./INSTALL.md) - Demarrage rapide
- [TODO](./TODO.md) - Prochaines etapes

## Demarrage rapide

```bash
# Cloner le repo
git clone https://github.com/nathanudu30-ai/KingdomClash.git
cd KingdomClash

# Installer les dependances
npm install

# Lancer le serveur de dev
npx expo start
```

## Licence

Projet prive - Tous droits reserves.
