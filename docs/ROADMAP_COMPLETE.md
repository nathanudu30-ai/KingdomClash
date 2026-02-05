# 📋 ROADMAP COMPLÈTE - KINGDOM CLASH

## Vue d'ensemble du développement

Ce document présente la roadmap complète du développement de Kingdom Clash sur 24 semaines, du concept initial jusqu'au soft launch. Chaque phase est détaillée avec ses objectifs, livrables, et dépendances techniques.

---

## PHASE 1-2 : FONDATIONS & SLOT MACHINE (Semaines 1-5)

### Objectifs
Établir l'architecture technique du projet et développer le cœur du gameplay : la machine à sous. Cette phase pose les bases solides sur lesquelles tout le reste du jeu sera construit.

### Architecture technique

**Structure globale du projet :**
Le projet utilise React Native avec Expo pour créer une application mobile native déployée sur l'App Store (iOS) et le Google Play Store (Android). La structure se divise entre le frontend React Native pour l'interface utilisateur, le backend Supabase pour les données et l'authentification, et une couche de logique métier pour les mécaniques de jeu. Les composants UI suivent le pattern atomic design avec un design system custom basé sur React Native StyleSheet et des composants réutilisables. Le système d'animations utilise React Native Reanimated pour les transitions fluides et les animations complexes du slot machine. L'audio est géré via expo-av pour les sons et effets haptiques.

**Base de données PostgreSQL :**
Le schéma initial comprend les tables essentielles : players pour les profils utilisateurs avec leurs ressources (coins, gems, spins, shields), districts pour les zones construites, spin_history pour l'historique des spins, et les tables de configuration pour les symboles et probabilités du slot. Toutes les tables utilisent Row Level Security pour garantir que les joueurs ne peuvent accéder qu'à leurs propres données.

### Design System

**Palette de couleurs moderne :**
Le jeu adopte une esthétique urbaine moderne avec une palette basée sur des bleus électriques (primary #0EA5E9) contrastés avec des oranges énergiques (accent #F97316). Les backgrounds utilisent des tons navy profonds (#0F172A) pour créer une ambiance nocturne urbaine, tandis que les cartes et éléments interactifs bénéficient d'effets de glassmorphism subtils. Cette palette crée une ambiance premium et moderne qui se démarque des jeux cartoon classiques.

**Typographie et composants :**
La typographie combine Poppins en gras pour les headers (poids 700-900) et Inter pour le corps de texte (poids 400-600). Les composants UI incluent des boutons avec des variantes multiples (primary, secondary, ghost, danger), des cards avec effets de verre, des modales avec animations fluides, et des barres de progression enrichies de particules. Chaque composant respecte des border-radius généreux (16-24px) et intègre des shadows néon subtiles pour l'effet premium.

### Slot Machine

**Configuration du système :**
La machine à sous utilise 3 rouleaux avec 6 symboles différents : Coins (30% de chance), Attack (15%), Raid (15%), Shield (20%), Energy (15%), et Wildcard (5%). Le système de paris offre trois niveaux de multiplicateurs : x1 pour 1 spin, x2 pour 3 spins avec bonus de 20%, et x5 pour 10 spins avec bonus de 33%. Les combinaisons gagnantes suivent une logique simple : trois symboles identiques multiplient la récompense par 5, deux identiques par 2, et trois wildcards déclenchent le jackpot avec un multiplicateur de 100.

**Animations et feedback visuel :**
Chaque spin dure environ 2-3 secondes avec une animation échelonnée des rouleaux. Le premier rouleau s'arrête à 1 seconde, le second à 1,5 seconde, et le troisième à 2 secondes. L'animation utilise des effets de blur pendant la rotation rapide, suivis d'un effet elastic lors de l'arrêt pour créer une sensation de poids et de satisfaction. Les symboles apparaissent avec un léger bounce et sont accompagnés de sons distincts. Lorsqu'une combinaison gagnante est détectée, des particules dorées explosent de l'écran et le résultat est célébré par une animation de pluie de pièces si applicable.

**Système d'auto-spin :**
Les joueurs peuvent activer l'auto-spin pour 10, 50 ou 100 spins consécutifs. Le système lance automatiquement les spins avec un délai de 500ms entre chaque pour maintenir le rythme sans saturer l'utilisateur. Un bouton stop permet d'arrêter l'auto-spin à tout moment. Cette feature est essentielle pour les joueurs qui veulent progresser rapidement sans interaction constante, particulièrement utile lors des events double coins.

**Système audio :**
expo-av gère tous les sons du jeu avec un système de pooling pour éviter les latences. Chaque action a son son distinctif : le démarrage du spin produit un roulement de tambour crescendo, chaque rouleau qui s'arrête fait un "clunk" métallique satisfaisant, les gains de coins produisent des "bling" cristallins, et les gros gains déclenchent une fanfare épique. Les sons peuvent être ajustés en volume ou désactivés dans les settings. Le système supporte les vibrations haptiques natives via expo-haptics pour renforcer le feedback tactile (léger pour chaque rouleau qui s'arrête, fort pour les gros gains).

### Système d'authentification

**Stratégie multi-méthodes :**
L'authentification utilise Supabase Auth qui supporte nativement plusieurs méthodes de connexion. Le jeu propose trois options principales : inscription par email/mot de passe (méthode classique avec confirmation par email), connexion OAuth sociale via Google et Apple (obligatoire pour iOS), et un mode invité (guest account) qui permet de jouer immédiatement sans inscription. Le mode invité crée un compte anonyme Supabase lié au device, et le joueur peut convertir son compte invité en compte permanent à tout moment sans perdre sa progression.

**Flux d'authentification :**
À la première ouverture, le joueur voit un écran d'accueil avec trois boutons : "Jouer en tant qu'invité" (bouton principal, le plus visible pour réduire la friction), "Se connecter avec Google/Apple" (boutons OAuth), et "Créer un compte" (email/password). Le mode invité est poussé en premier car chaque étape supplémentaire dans le funnel d'inscription réduit le taux de conversion de 20-30%. Une fois engagé dans le jeu, des prompts non-intrusifs encouragent la conversion du compte invité vers un compte permanent ("Sauvegardez votre progression ! Créez un compte en 10 secondes").

**Sécurité de l'authentification :**
Les mots de passe sont hashés côté serveur par Supabase (bcrypt). Les tokens JWT ont une durée de vie de 1 heure avec refresh token automatique. Le rate limiting est appliqué sur les tentatives de connexion (5 tentatives max par 15 minutes par IP). La récupération de mot de passe passe par un lien magique envoyé par email. Les sessions sont invalidées côté serveur en cas de changement de mot de passe. Toutes les communications passent par HTTPS.

### Profil joueur

**Structure du profil :**
Chaque joueur possède un profil visible par les autres joueurs. Le profil affiche l'avatar (choisi parmi 50+ options de base, avec des avatars premium débloquables), le pseudonyme (unique, modifiable 1 fois par mois pour 50 gems), le niveau, le tier de ligue actuel, le nombre de districts complétés, la guilde, et le titre actif (obtenu via achievements). Les statistiques détaillées incluent : total de spins, taux de victoire, coins gagnés totaux, nombre d'attaques réussies, nombre de raids, plus gros gain en un spin, et durée de jeu totale.

**Historique d'activité :**
Le profil inclut un historique des 50 dernières actions significatives : districts complétés, attaques données/reçues, sets de cartes complétés, achievements débloqués, et montées de ligue. Cet historique est visible publiquement et crée un "feed" d'activité qui humanise le joueur et donne du contexte lors des interactions PvP ("Ce joueur vient de compléter un district, il a probablement beaucoup de coins").

**Page de settings :**
Les paramètres du joueur incluent : gestion du compte (email, mot de passe, suppression de compte), préférences audio (volume musique, volume effets, vibrations on/off), préférences de notification (granulaires par type), langue du jeu, et informations légales (CGU, politique de confidentialité, mentions légales). Un bouton de contact support est toujours accessible depuis les settings.

### Livrables Phase 1-2
À la fin de cette phase, le jeu dispose d'un slot machine entièrement fonctionnel et jouable, avec un design system complet, une architecture évolutive, et tous les composants UI de base. Les joueurs peuvent créer un compte (email, OAuth, ou invité), personnaliser leur profil, recevoir des spins gratuits, et jouer au slot avec des animations fluides et un feedback audio satisfaisant.

---

## PHASE 3 : CONSTRUCTION URBAINE (Semaines 6-8)

### Objectifs
Développer le système de progression principale du jeu : la construction de districts urbains. Les joueurs utilisent les coins gagnés au slot pour construire et améliorer des bâtiments, débloquer de nouveaux districts, et progresser à travers une série de thèmes urbains variés.

### Système de niveaux

**Niveau = Districts complétés :**
Le système de niveaux est volontairement simple et lisible, inspiré de Coin Master. Le niveau du joueur correspond directement au nombre de districts qu'il a complétés. Un joueur qui a complété 5 districts est niveau 5. Il n'y a pas de système d'XP séparé : la progression est claire, tangible, et liée à un accomplissement concret. Le niveau s'affiche partout (profil, chat, leaderboards, écran PvP) et sert de référence pour le matchmaking, les conditions d'accès aux features (guildes au niveau 5, ligues au niveau 10), et le scaling des récompenses et des coûts.

### Système de districts

**Structure des districts :**
Chaque district contient exactement 4 bâtiments : HQ (Headquarters), Bank, Factory, et Tower. Chaque bâtiment possède 5 niveaux d'amélioration, ce qui donne 20 upgrades à compléter par district. Les coûts augmentent exponentiellement : le premier niveau coûte environ 5000 coins, le niveau 5 peut coûter 300000 coins. Compléter entièrement un district requiert approximativement 3 millions de coins, soit environ 6000 spins, ce qui représente plusieurs jours de jeu pour un joueur gratuit ou quelques heures pour un joueur payant.

**Thématiques et progression :**
Le jeu lance avec 15-20 districts au lancement, chacun avec sa thématique unique et son esthétique visuelle illustrée en 2D (style Coin Master). Les premiers districts représentent des quartiers modestes : Street Corner (ghetto), Food Market (marché), Garage District (industriel). La progression continue vers des zones plus prestigieuses : Downtown (urbain), Business Park (corporatif), Harbor (port), Tech Campus (silicon valley). De nouveaux districts sont ajoutés régulièrement en live ops (1-2 par mois post-launch) pour maintenir la fraîcheur du contenu et donner aux joueurs des raisons de revenir.

### Rendu 2D illustré des bâtiments

**Style visuel Coin Master :**
Chaque bâtiment est rendu en illustrations 2D colorées et détaillées, dans un style cartoon/illustratif similaire à Coin Master. Les bâtiments évoluent visuellement à chaque niveau : au niveau 1, le HQ est une simple baraque en bois ; au niveau 5, c'est un gratte-ciel moderne avec des fenêtres illuminées et des néons. Chaque niveau intermédiaire montre une évolution progressive (ajout d'un étage, d'une enseigne, d'une clôture, etc.). Les illustrations sont réalisées en PNG/SVG haute résolution avec des versions @2x et @3x pour les écrans Retina. Le style est coloré, fun, et immédiatement lisible sur petit écran.

**Animations de construction :**
Lorsqu'un joueur upgrade un bâtiment, une animation de 2 secondes se déclenche via React Native Reanimated. L'ancien bâtiment se réduit avec un effet de squash, disparaît dans un flash lumineux, puis la nouvelle illustration apparaît avec un effet de scale-up et un léger bounce. Des confettis et particules dorées explosent autour du bâtiment complété (rendu via react-native-skia ou des animations Lottie pré-rendues). Un son de fanfare célèbre l'accomplissement et une vibration haptique accompagne le feedback. Ces animations créent une satisfaction immédiate et récompensent visuellement chaque progression.

### Transitions entre districts

**Système de déblocage :**
Compléter tous les bâtiments d'un district au niveau maximum déclenche une cinématique de célébration épique. L'écran zoome out pour montrer tout le district complété, des feux d'artifice virtuels explosent, et un résumé des accomplissements s'affiche (temps passé, coins dépensés, nombre de spins utilisés). Le joueur reçoit des récompenses : bonus de coins, gems, un coffre de cartes, et débloquer le district suivant. Une transition animée emmène ensuite le joueur vers son nouveau district vierge, avec une courte présentation de la nouvelle thématique.

**Persistence et synchronisation :**
Tous les états de construction sont sauvegardés en temps réel dans Supabase. Chaque upgrade déclenche immédiatement une sauvegarde, et le système gère les conflits en cas de connexion instable. Si un joueur ferme l'application pendant une animation de construction, celle-ci sera complétée côté serveur et le bâtiment apparaîtra upgraded à la prochaine ouverture. Cette robustesse est critique pour maintenir la confiance des joueurs qui investissent des ressources précieuses.

### Système d'inventaire

**Structure de l'inventaire :**
L'inventaire du joueur centralise tous les items consommables et bonus du jeu. Les items principaux sont : les shields (protection contre les attaques, stockables jusqu'à 10 max), les boosts temporaires (double coins ×2h, double XP ×1h, spin speed ×30min), les coffres de cartes (petit, moyen, grand, stockables sans limite), et les items d'événements spéciaux (clés, tickets, tokens saisonniers). Chaque item possède un ID unique, une quantité, une date d'obtention, et éventuellement une date d'expiration pour les items temporaires.

**Interface d'inventaire :**
L'inventaire est accessible depuis le profil du joueur ou via un raccourci dans la navigation. L'interface affiche les items sous forme de grille visuelle avec des icônes claires, la quantité en badge, et un indicateur de rareté (bordure colorée : gris common, bleu rare, violet epic, doré legendary). Taper sur un item ouvre une popup de détail avec la description, l'effet, et un bouton "Utiliser" si applicable. Les items à expiration affichent un timer visible.

**Gestion serveur-side :**
Toute modification de l'inventaire est validée côté serveur via les Edge Functions Supabase. Le client ne peut jamais ajouter ou modifier directement un item dans la table `player_inventory`. Cela empêche les exploits courants comme la duplication d'items ou l'injection de ressources. Chaque utilisation d'item est loguée dans une table `inventory_log` pour audit et détection d'anomalies.

### Livrables Phase 3
À la fin de cette phase, les joueurs peuvent progresser à travers des dizaines de districts uniques, chacun avec son ambiance visuelle et sonore. Le système de construction est smooth, gratifiant, et visuellement impressionnant. L'inventaire centralise tous les items du joueur. La boucle addictive spin-coins-construction est complète et fonctionnelle.

---

## PHASE 4 : SYSTÈME PVP (Semaines 9-11)

### Objectifs
Introduire la dimension sociale compétitive qui transforme Kingdom Clash d'un jeu solo satisfaisant en une expérience sociale addictive. Le PvP ajoute du risque, de l'excitation, et des opportunités d'interaction entre joueurs.

### Matchmaking intelligent

**Algorithme de ciblage :**
Le système de matchmaking sélectionne trois cibles potentielles pour chaque joueur. Les critères de sélection assurent des combats équilibrés : la différence de niveau ne peut excéder 5 niveaux (plus ou moins), la différence de district ne peut dépasser 2 districts, et la cible doit posséder au minimum 10% des coins du joueur attaquant (pour éviter d'attaquer des joueurs pauvres sans intérêt). Le système exclut automatiquement les membres de la même guilde, les cibles attaquées dans les 24 dernières heures, et les joueurs qui ont été attaqués plus de 10 fois dans les dernières 24 heures (protection contre le harcèlement).

**Pool de cibles et refresh :**
Une fois qu'un joueur reçoit ses 3 cibles, ce pool reste valide pour 1 heure. Après une heure ou si les 3 cibles ont été attaquées, un nouveau pool est généré gratuitement. Les joueurs peuvent aussi dépenser 10 gems pour refresh immédiatement leur pool s'ils ne sont pas satisfaits des cibles proposées. Cette limitation encourage les joueurs à être stratégiques dans le choix de leurs cibles plutôt que de chercher indéfiniment la cible parfaite.

### Système d'attaque

**Mécanique d'attaque :**
Lorsqu'un joueur obtient le symbole Attack sur le slot, il peut choisir une cible parmi son pool. L'attaque vole entre 10% et 30% des coins totaux de la victime, le pourcentage exact étant déterminé aléatoirement pour ajouter un élément de chance et d'excitation. Si la victime possède un shield actif, l'attaque est bloquée : le shield est consommé, aucun coin n'est volé, mais le revenge n'est pas accordé (car l'attaque a été bloquée). Cette mécanique rend les shields très précieux et encourage les joueurs à les conserver pour les moments où ils accumulent beaucoup de coins.

**Feedback visuel et émotionnel :**
L'animation d'attaque est spectaculaire pour créer une satisfaction viscérale. L'écran affiche la base de la victime avec ses bâtiments, puis une fusée ou un personnage stylisé apparaît et "attaque" un bâtiment au hasard. Le bâtiment tremble, des explosions de coins en sortent, et les coins volés volent vers l'écran de l'attaquant avec une animation de compteur qui s'incrémente rapidement. Un écran de victoire affiche le total volé avec une voix over "RAID SUCCESSFUL!" et des particules dorées.

### Système de raid

**Mini-jeu de creusage :**
Le raid, déclenché par le symbole Raid sur le slot, lance un mini-jeu interactif différent de l'attaque automatique. L'écran affiche une grille de 3x3 (9 trous) représentant le terrain de la victime. Le joueur dispose de 3 creusages et doit choisir stratégiquement quels trous creuser. Sous chaque trou se cache soit un sac de coins (petit : 50-200 coins, moyen : 200-1000 coins, grand : 1000-5000 coins), soit rien. La distribution est générée aléatoirement mais garantit toujours au moins un sac par raid. Cette mécanique interactive ajoute de l'agence au joueur et crée des moments de suspense addictifs.

**Stratégie et psychologie :**
Les joueurs développent rapidement des superstitions et des stratégies (certains creusent toujours les coins, d'autres le centre, d'autres aléatoirement). Cette illusion de contrôle, même si le résultat est prédéterminé, augmente l'engagement et la satisfaction. Le système peut même subtilement "truquer" les résultats pour assurer que les joueurs ne soient pas trop malchanceux d'affilée, maintenant un équilibre entre frustration et récompense.

### Système de revenge

**Mécanique de revanche :**
Chaque attaque subie offre au joueur victime une opportunité de revenge pendant 24 heures. La liste des revenges disponibles s'affiche dans une interface dédiée, montrant qui vous a attaqué, combien de coins ont été volés, et quand. Cliquer sur un revenge vous permet d'attaquer cette personne directement, contournant votre pool de cibles normal. Le revenge n'est pas bloqué par les shields (représentant l'idée que vous avez des informations sur leur sécurité grâce à l'attaque initiale), ce qui encourage fortement les joueurs à se venger immédiatement.

**Cycle viral de PvP :**
Le système de revenge crée un cycle viral d'engagement. Le joueur A attaque le joueur B, qui reçoit une notification push et se connecte pour se venger. Il vole encore plus de coins à A, qui reçoit maintenant une notification de revenge, se reconnecte, et le cycle continue. Ce système transforme les joueurs en "content" les uns pour les autres, créant un engagement organique sans nécessiter de contenu généré par l'équipe de développement.

### Notifications push stratégiques

**Triggers d'attaque :**
Chaque attaque déclenche immédiatement une notification push à la victime. Le message est personnalisé avec le nom de l'attaquant et le montant volé : "PlayerX a volé 50,000 coins! Prends ta revanche maintenant!" avec un bouton d'action directe qui ouvre l'app sur l'écran de revenge. Le timing est critique : la notification doit arriver dans les secondes suivant l'attaque pour créer un sentiment d'urgence et d'indignation qui pousse à l'action immédiate.

**Optimisation des notifications :**
Le système respecte les bonnes pratiques de notifications : pas plus d'une notification d'attaque par 30 minutes (même si plusieurs attaques se produisent), respect des fuseaux horaires (pas de notifications entre 23h et 8h heure locale), et permettre aux joueurs de désactiver certaines notifications tout en gardant les plus importantes activées. Cette modération évite de spam les joueurs et maintient l'efficacité des notifications.

### Système anti-triche

**Principe fondamental : ne jamais faire confiance au client.**
Toute la logique critique du jeu est exécutée côté serveur via les Edge Functions Supabase. Le client envoie uniquement des intentions ("je veux spinner", "je veux attaquer le joueur X") et le serveur valide, calcule, et retourne le résultat. Le client ne peut jamais injecter un résultat de spin, modifier ses coins, ou forcer une attaque. Ce principe s'applique à toutes les actions qui modifient les ressources ou l'état d'un joueur.

**Validation serveur-side détaillée :**
Chaque action passe par une chaîne de validation stricte. Pour un spin : le serveur vérifie que le joueur a assez de spins, génère le résultat aléatoire côté serveur (jamais côté client), calcule les récompenses, met à jour la DB en transaction atomique, et retourne le résultat au client. Pour une attaque PvP : le serveur vérifie que la cible est dans le pool valide du joueur, que le joueur a un symbole Attack disponible, que la cible n'est pas protégée par un shield, calcule le butin, effectue le transfert de coins en transaction atomique, et envoie la notification.

**Rate limiting et détection d'anomalies :**
Un rate limiter est appliqué sur toutes les API critiques : maximum 2 spins par seconde (empêche les speed hacks), maximum 10 attaques par heure, maximum 100 requêtes API par minute globalement. Le système détecte les patterns anormaux : si un joueur gagne des coins à un rythme statistiquement impossible (plus de 3 écarts-types au-dessus de la moyenne), si un joueur effectue des actions plus vite que possible via l'UI normale, ou si les timestamps des requêtes sont incohérents. Les joueurs flaggés sont automatiquement loggés pour review manuelle, et en cas de triche confirmée, le compte est banni avec possibilité d'appel.

**Protection de la mémoire et du réseau :**
Côté client, les données sensibles (coins, gems, spins) ne sont jamais stockées en variables globales accessibles depuis la console. Les réponses API sont signées avec un hash HMAC qui empêche la modification des payloads en transit. Les WebSockets Supabase Realtime utilisent des channels authentifiés qui rejettent les connexions non autorisées. En production, les outils de développement du navigateur sont détectés (sans bloquer, mais en loggant l'activité suspecte).

### Livrables Phase 4
À la fin de cette phase, Kingdom Clash dispose d'un système PvP complet, équilibré, sécurisé, et addictif. Les joueurs peuvent attaquer, raider, se protéger avec des shields, et se venger. Le système anti-triche garantit l'intégrité des résultats et l'équité entre joueurs. Le jeu est transformé en expérience sociale compétitive où chaque session apporte potentiellement des surprises (nouvelles attaques subies, revenges disponibles).

---

## PHASE 5 : SOCIAL & GUILDES (Semaines 12-14)

### Objectifs
Développer la couche sociale la plus profonde du jeu. Les guildes transforment Kingdom Clash d'une collection d'interactions 1v1 en une expérience communautaire riche où les joueurs collaborent, compétitionnent en équipes, et forment des liens sociaux durables. Cette phase inclut également le système d'amis, prérequis au trading de cartes.

### Système d'amis

**Ajout d'amis :**
Les joueurs peuvent ajouter des amis de trois manières : recherche par pseudonyme exact (avec suggestions si le pseudo est proche), envoi d'un lien d'invitation partageable (via SMS, WhatsApp, ou réseaux sociaux), et suggestion automatique de joueurs rencontrés en PvP (les 10 derniers adversaires apparaissent dans une section "Joueurs récents"). Une demande d'ami doit être acceptée par le destinataire avant que la relation ne soit établie. Chaque joueur peut avoir jusqu'à 200 amis.

**Liste d'amis et interactions :**
La liste d'amis affiche pour chaque ami : son avatar, pseudo, niveau, ligue, statut en ligne (en ligne/hors ligne/dernière connexion), et un indicateur de guilde. Depuis la liste, le joueur peut envoyer un cadeau (spins ou coins), proposer un trade de cartes, visiter le district de l'ami (mode spectateur en lecture seule), ou supprimer l'ami. Un système de "meilleurs amis" met en avant les 5 amis avec qui on interagit le plus (dons, trades), leur donnant un badge spécial et les plaçant en haut de la liste.

**Invitation virale et récompenses de parrainage :**
Chaque joueur dispose d'un code de parrainage unique et d'un lien d'invitation. Quand un nouveau joueur s'inscrit via ce lien, le parrain reçoit 50 spins et 10 gems, et le filleul reçoit un bonus de démarrage de 100 spins et 50,000 coins. Les récompenses de parrainage sont échelonnées : le premier ami parrainé donne un bonus de base, le 5ème un bonus doublé, le 10ème un coffre de cartes épiques, et le 25ème un avatar exclusif "Social Butterfly". Ce système transforme chaque joueur en ambassadeur du jeu.

**Notifications d'amis :**
Le système notifie les événements entre amis de manière sélective : quand un ami envoie un cadeau (immédiat), quand un ami complète un district (regroupé quotidiennement), quand un ami se fait attaquer (si l'option est activée, permet de "venger" ses amis - feature optionnelle future). Ces notifications créent un tissu social qui connecte les joueurs même quand ils ne jouent pas activement ensemble.

### Structure des guildes

**Création et gestion :**
N'importe quel joueur niveau 5+ peut créer une guilde pour 100 gems. Le créateur devient automatiquement le leader et peut nommer jusqu'à 3 co-leaders et 5 elders. Les guildes commencent avec 25 places de membres et peuvent en débloquer jusqu'à 50 en améliorant le niveau de la guilde. Chaque guilde possède un nom unique, un tag de 3-4 lettres affiché à côté du nom des membres, une description, et un emblème customisable choisi parmi 50+ options (ou uploadé via achat premium).

**Settings de guilde :**
Les leaders contrôlent les paramètres de la guilde : type (ouverte, sur invitation, fermée), niveau minimum requis pour rejoindre, nombre de trophées minimum, langue principale, et région. Ces filtres aident les joueurs à trouver des guildes alignées avec leur niveau d'engagement et leur style de jeu. Les guildes peuvent être découvertes via une page de recherche avec filtres, ou rejointes via invitation directe d'un membre.

### Chat de guilde temps réel

**Infrastructure technique :**
Le chat utilise Supabase Realtime pour synchroniser instantanément les messages entre tous les membres connectés. Chaque message est stocké en base de données avec son auteur, timestamp, et contenu. Le système garde les 200 derniers messages en mémoire et permet de charger l'historique plus ancien par pagination. Les messages supportent le texte simple, les emojis (liste standard), et des liens spéciaux vers des replays d'attaques ou des profils de joueurs.

**Features sociales :**
Les membres peuvent mentionner d'autres joueurs avec @username, ce qui déclenche une notification push au joueur mentionné. Certains messages automatiques du système apparaissent également : quand un membre rejoint ou quitte la guilde, quand quelqu'un upgrade la guilde, quand un boss est vaincu, etc. Ces messages automatiques créent un sentiment de vie et d'activité dans le chat même pendant les périodes calmes.

### Modération du chat

**Filtre automatique :**
Tous les messages passent par un filtre de mots interdits avant publication. Le filtre couvre les insultes, le langage haineux, les contenus sexuels, et le spam dans les langues supportées. Le filtre est configurable côté serveur et mis à jour sans mise à jour de l'app. Les messages contenant des mots filtrés sont soit bloqués (contenu très offensant), soit censurés avec des astérisques (contenu modéré). Le filtre utilise aussi la détection de contournement (espaces entre les lettres, caractères spéciaux, leet speak).

**Outils de modération :**
Les leaders et co-leaders de guilde ont des pouvoirs de modération : supprimer un message, mute un membre (1h, 24h, 7j, permanent), kicker un membre, et bannir un membre (avec impossibilité de re-rejoindre). Les elders peuvent uniquement mute pendant 1h. Chaque action de modération est loguée. Les joueurs peuvent aussi signaler un message via un bouton "Signaler" qui envoie le message, le contexte (5 messages avant/après), et les informations du signaleur à une file de modération.

**Signalement et sanctions :**
Les signalements sont revus manuellement (ou via un système automatisé si le volume le justifie). Les joueurs avec plusieurs signalements confirmés reçoivent des sanctions progressives : avertissement, mute global de 24h, mute global de 7j, suspension temporaire du compte, et bannissement permanent en cas de récidive grave. Les sanctions sont communiquées au joueur avec la raison et la possibilité de faire appel.

### Système de dons

**Dons entre membres :**
Les membres peuvent s'envoyer des cadeaux de spins (5 spins par don, max 5 dons par jour) et de coins (10,000 coins par don, max 5 dons par jour). Chaque don a un cooldown de 1 heure entre deux dons à la même personne, évitant les abus. Envoyer des dons rapporte de l'XP à la guilde et apparaît dans le chat, créant une culture de générosité et de réciprocité. Les joueurs qui donnent beaucoup sont valorisés et respectés par la communauté.

**Demandes de ressources :**
Les joueurs peuvent poster une demande dans le chat de guilde ("J'ai besoin de spins pour finir mon district!"), et les autres membres peuvent répondre en envoyant des dons. Ce système simple mais efficace crée des interactions positives fréquentes et renforce les liens sociaux. Les membres actifs et généreux sont plus susceptibles de recevoir de l'aide quand ils en ont besoin, créant une économie de réciprocité.

### Boss raids coopératifs

**Mécanique du boss hebdomadaire :**
Chaque semaine, un boss apparaît dans la guilde avec un pool de points de vie énorme (1 million HP pour commencer, scaling avec le niveau de la guilde). Chaque membre peut attaquer le boss en dépensant 10 spins. Le montant de dégâts infligés dépend du niveau du joueur (formule : niveau × 1000). Les dégâts de tous les membres s'accumulent jusqu'à vaincre le boss.

**Récompenses et collaboration :**
Quand le boss est vaincu, tous les membres qui ont participé reçoivent des récompenses proportionnelles à leur contribution : celui qui a infligé le plus de dégâts reçoit un bonus, le top 3 reçoit des récompenses premium, et tous les participants reçoivent une récompense de base. Les récompenses incluent coins, gems, spins, et des coffres de cartes rares. Cette mécanique encourage la collaboration et donne une raison concrète de rester actif dans sa guilde.

**Stratégie et timing :**
Les guildes doivent coordonner leurs attaques. Attaquer tôt dans la semaine garantit plus de temps pour vaincre le boss, mais attendre permet aux membres de recharger leurs spins. Les guildes organisées utilisent le chat pour planifier des "raid hours" où tout le monde attaque simultanément pour vaincre le boss rapidement. Cette coordination renforce la cohésion et le sentiment d'appartenance.

### Guerres de guildes

**Format de guerre :**
Les guerres de guildes durent 48 heures et opposent deux guildes de niveau similaire. Il y a une période de préparation de 24 heures où les guildes peuvent se préparer, puis 48 heures de guerre active. Chaque membre dispose de 3 attaques qu'il peut utiliser pour raid des membres de la guilde ennemie. Chaque raid rapporte 1-3 étoiles selon les dégâts infligés, et la guilde avec le plus d'étoiles totales à la fin gagne.

**Matchmaking de guerre :**
Le système trouve des adversaires avec un niveau de guilde similaire et un nombre de membres actifs similaire. L'objectif est de créer des guerres équilibrées où les deux guildes ont une chance réaliste de gagner. Les guerres déséquilibrées frustrent les deux parties (victoire trop facile ou défaite inévitable), donc le matchmaking est critique pour maintenir l'engagement.

**Récompenses de guerre :**
La guilde gagnante reçoit des récompenses significatives distribuées à tous les membres participants : 500 gems, 1 million de coins, des cartes légendaires, et un boost temporaire de production de ressources (24h de double coins/spins). La guilde perdante reçoit des récompenses de consolation (100 gems, 200k coins) pour éviter une frustration totale. Le système encourage fortement la participation en donnant de meilleures récompenses individuelles aux joueurs qui ont utilisé leurs 3 attaques.

### Livrables Phase 5
À la fin de cette phase, le système social est complet. Les joueurs peuvent ajouter des amis, envoyer des cadeaux, parrainer de nouveaux joueurs, et interagir via le système d'amis. Les guildes sont le cœur social du jeu : les joueurs interagissent quotidiennement via le chat, s'entraident avec des dons, collaborent pour vaincre des boss, et compétitionnent dans des guerres épiques. Les guildes actives deviennent des communautés soudées où les joueurs se font de vrais amis et restent engagés à long terme.

---

## PHASE 6 : COLLECTION DE CARTES (Semaines 15-16)

### Objectifs
Ajouter une couche de collection et de complétion qui motive la progression à long terme. Les cartes offrent des objectifs intermédiaires satisfaisants entre les districts et créent des opportunités d'interaction sociale via le trading.

### Sets de cartes thématiques

**Structure des sets :**
Le jeu lance avec 15 sets de cartes, chacun contenant 9 cartes. Les sets sont thématiques et correspondent aux univers des districts : Street Gang (common), Corporate Elite (common), Tech Moguls (rare), Criminal Masterminds (rare), World Leaders (epic), Legends (legendary). Chaque set possède une difficulté de complétion croissante basée sur sa rareté, les sets legendary nécessitant potentiellement des mois pour être complétés par un joueur gratuit.

**Design des cartes :**
Chaque carte est une illustration unique représentant un personnage ou un lieu iconique du set. Les cartes common ont un style illustratif simple, les rares ajoutent des effets de brillance et des animations subtiles, les epics ont des animations frame-by-frame, et les legendaries possèdent des animations complexes et des effets holographiques. Collectionner une carte déclenche une animation de révélation satisfaisante avec des effets de lumière et un son distinctif selon la rareté.

### Système d'obtention

**Coffres de district :**
Compléter un district octroie automatiquement un coffre contenant 3 cartes aléatoires. La rareté des cartes est pondérée : 70% common, 25% rare, 4% epic, 1% legendary. Ce système assure une progression constante de la collection tout en gardant les cartes legendaires suffisamment rares pour être excitantes. Les joueurs peuvent aussi acheter des coffres avec des gems : petit coffre (10 gems, 1 carte), moyen coffre (50 gems, 5 cartes avec garantie d'au moins 1 rare), grand coffre (200 gems, 25 cartes avec garantie de 1 epic).

**Events card rush :**
Mensuellement, un event "Card Rush" double le taux de drop des cartes pendant 72 heures. Pendant cet event, les coffres donnent 6 cartes au lieu de 3, et le taux de legendary passe à 2%. Ces events créent des pics d'engagement massifs alors que les joueurs grindent intensément pour profiter des bonus. Le chat de guilde s'anime avec des joueurs partageant leurs drops légendaires, créant du FOMO et de l'excitation collective.

### Système de trading

**Mécanique d'échange :**
Les joueurs ne peuvent trader qu'avec leurs amis in-game pour éviter les abus et les marchés noirs. Pour proposer un trade, un joueur sélectionne des cartes qu'il possède en double et des cartes qu'il souhaite obtenir, puis envoie la proposition. L'ami peut accepter, refuser, ou contre-proposer un trade différent. Une fois accepté, les cartes sont transférées instantanément et de manière atomique (impossible de perdre des cartes dans une transaction qui échoue).

**Économie du trading :**
Le trading est limité à 10 trades par jour pour éviter que des joueurs créent des fermes de comptes pour farmer des cartes. Il y a aussi un cooldown de 5 minutes entre deux trades avec la même personne. Ces limitations créent une économie de rareté où les cartes vraiment rares conservent leur valeur et leur prestige. Les joueurs développent des réputations de traders équitables ou de "sharks" qui proposent des échanges déséquilibrés, ajoutant une dimension sociale intéressante.

**Interface de trading sociale :**
L'interface montre clairement quelles cartes manquent à chaque joueur, suggérant automatiquement des trades équitables. Si vous avez un double d'une carte que votre ami cherche et vice-versa, le système le met en évidence. Cette intelligence artificielle légère facilite les transactions et réduit la friction, encourageant plus de trades et donc plus d'interactions sociales positives.

### Récompenses de complétion

**Incentives par set :**
Compléter un set entier de 9 cartes octroie une récompense significative proportionnelle à la rareté du set. Les sets common donnent 50,000 coins et 25 spins. Les sets rare donnent 150,000 coins, 50 spins, et 10 gems. Les sets epic donnent 500,000 coins, 100 spins, 50 gems, et un avatar exclusif. Les sets legendary donnent 1 million de coins, 200 spins, 100 gems, un avatar légendaire, et un titre unique. Ces récompenses transforment la collection de cartes d'un hobby passif en un objectif stratégique actif.

**Achievements de collection :**
Des achievements récompensent les collectionneurs hardcore : compléter 5 sets, compléter 10 sets, compléter tous les sets, obtenir 100 cartes legendaries, etc. Ces achievements donnent des gems et des titres prestigieux qui affichent le dévouement du joueur. Les plus grands collectionneurs sont célébrés dans le leaderboard de collection, créant une méta-compétition parallèle au PvP classique.

### Livrables Phase 6
À la fin de cette phase, la collection de cartes est un pilier addictif du jeu. Les joueurs ouvrent des coffres avec excitation, échangent activement avec leurs amis, et poursuivent la complétion de sets avec détermination. Cette couche ajoute de la profondeur et de la longévité au jeu.

---

## PHASE 7 : LIGUES & COMPÉTITION (Semaines 17-18)

### Objectifs
Introduire une structure compétitive claire avec des ligues, des saisons, et des récompenses qui motivent les joueurs à s'améliorer continuellement. Ce système transforme la progression du jeu d'un marathon sans fin en une série de sprints avec des récompenses régulières.

### Système de ligues à 5 tiers

**Structure hiérarchique :**
Tous les joueurs commencent en Bronze League (0-999 points). Gagner des points via des victoires PvP, des districts complétés, et des participations aux events permet de monter en Silver (1000-2499 points), Gold (2500-4999 points), Diamond (5000-9999 points), et finalement Legend League (10,000+ points). Chaque tier a une couleur distinctive, un badge prestigieux, et des récompenses de fin de saison croissantes.

**Système de points :**
Les points sont gagnés par de multiples actions : attaque PvP réussie (+10 points), raid réussi (+15 points), district complété (+50 points), boss de guilde vaincu (+100 points), guerre de guilde gagnée (+500 points). Les points peuvent aussi être perdus : attaque PvP perdue (-5 points), être raidé avec succès (-10 points). Ce système bidirectionnel crée un risque de descendre de ligue si on ne reste pas actif, maintenant un sentiment d'urgence.

**Matchmaking basé sur les ligues :**
Le système de matchmaking PvP priorise les adversaires de la même ligue. Un joueur Bronze n'attaquera pratiquement jamais un joueur Legend, assurant des combats équilibrés et une progression méritocratique. Cette segmentation permet aux nouveaux joueurs de compétitionner entre eux sans être écrasés par les vétérans, et aux joueurs hardcore de se battre contre des adversaires de leur calibre.

### Saisons compétitives

**Durée et reset :**
Chaque saison dure exactement 30 jours calendaires. À la fin de la saison, les classements sont figés, les récompenses distribuées, et les points sont soft reset. Le soft reset signifie que les joueurs Legend descendent à 5000 points (Diamond), les Diamond à 2500 (Gold), les Gold à 1000 (Silver), et les Silver/Bronze à 0. Ce système permet aux joueurs d'avancer progressivement sans perdre tout leur progrès, tout en donnant une chance aux nouveaux joueurs de compétitionner pour les rangs supérieurs chaque saison.

**Récompenses de saison :**
Les récompenses sont distribuées selon le rang final et le tier de ligue. Le champion de la saison (rank 1 global) reçoit des récompenses massives : 5 millions de coins, 1000 gems, 500 spins, un titre "Season X Champion", et un avatar exclusif unique qui ne sera plus jamais disponible. Les top 10 reçoivent 2 millions de coins et 500 gems. Les top 100 reçoivent 500,000 coins et 200 gems. Tous les joueurs Legend reçoivent 250,000 coins et 100 gems, Diamond 100,000 coins et 50 gems, et ainsi de suite.

**Hype et communication :**
Les derniers jours de chaque saison sont intensément compétitifs. Des notifications push rappellent aux joueurs que la saison se termine bientôt, les encourageant à pousser pour un dernier rank up. Le leaderboard s'anime avec des batailles serrées pour les positions symboliques (rank 10, 100, 1000). Des messages in-game félicitent les joueurs qui atteignent un nouveau tier pour la première fois. Cette orchestration crée des pics d'engagement prévisibles et des moments de célébration collective.

### Leaderboards multiples

**Types de classements :**
Le jeu offre plusieurs leaderboards pour différents styles de compétition. Le leaderboard global classe tous les joueurs par points de ligue. Le leaderboard amis classe uniquement vos amis in-game, créant une compétition amicale à échelle humaine. Le leaderboard de guilde classe tous les membres de votre guilde, encourageant une compétition interne saine. Des leaderboards temporaires apparaissent pour les events spéciaux : leaderboard d'attaques cette semaine, leaderboard de districts complétés ce mois, etc.

**Visualisation et accessibilité :**
Les leaderboards sont accessibles en un tap depuis l'écran principal. L'interface affiche les top 100 globalement, mais permet aussi de voir sa propre position même si on est 10,000ème. Un système de "nearby players" montre les 5 joueurs juste au-dessus et en dessous de vous, créant des rivalités naturelles ("Je vais passer devant X!"). Les avatars et titres des joueurs sont affichés, permettant de reconnaître les top players et de les aspirer à les rejoindre.

**Incentives psychologiques :**
Les leaderboards exploitent des principes psychologiques puissants : le désir de statut social (être dans le top X%), la compétition entre pairs (battre ses amis), le fear of missing out (je dois jouer sinon je vais descendre), et la progression visible (monter de 1000 rangs en une semaine est très satisfaisant). Ces incentives transforment la progression en addiction positive où les joueurs reviennent volontairement pour améliorer leur rang.

### Livrables Phase 7
À la fin de cette phase, Kingdom Clash possède une structure compétitive robuste qui motive tous les types de joueurs. Les joueurs casual apprécient progresser dans les ligues à leur rythme. Les joueurs compétitifs s'affrontent pour les top ranks. Les saisons créent des cycles de renouvellement qui gardent le jeu frais. Les leaderboards donnent une reconnaissance sociale et des objectifs clairs à court terme.

---

## PHASE 8 : ÉCONOMIE & MONÉTISATION (Semaine 19)

### Objectifs
Équilibrer minutieusement l'économie du jeu pour maximiser la satisfaction des joueurs gratuits tout en créant des opportunités de monétisation attractives pour les joueurs payants. Le défi est de ne jamais rendre le jeu "pay to win" tout en générant un revenu durable.

### Balance économique

**Progression gratuite :**
Un joueur entièrement gratuit peut obtenir environ 103 spins par jour via différentes sources : 48 spins de régénération naturelle (1 spin toutes les 30 minutes), 20 spins du bonus quotidien, 10 spins du bonus horaire, 15 spins de cadeaux d'amis, et 10 spins de donations de guilde. À 500 coins moyens par spin, cela représente environ 51,500 coins par jour. Compléter un district coûte environ 3 millions de coins, donc un joueur gratuit peut compléter un district tous les 58 jours (environ 2 mois). Cette cadence assure que le jeu n'est jamais "fini" et qu'il y a toujours un objectif à poursuivre.

**Progression payante :**
Un joueur qui dépense 10€ par mois peut acheter 1500 spins (pack mega à 9.99€) plus quelques ressources avec le VIP pass. Cela représente environ 50 spins additionnels par jour, permettant de compléter un district en environ 7-10 jours. Cette accélération est significative mais n'est pas "game breaking" : les joueurs gratuits restent compétitifs, et la progression des payeurs reste challengeante et satisfaisante. La différence est le temps, pas la possibilité.

**Sinks et faucets :**
Le jeu nécessite des "sinks" (mécanismes qui retirent des ressources) pour éviter l'inflation et maintenir la valeur perçue des coins. Les principaux sinks sont les upgrades de bâtiments (consomme des coins), le refresh de cibles PvP (consomme des gems), l'achat de coffres de cartes (consomme des gems). Les "faucets" (sources de ressources) incluent les spins, les attaques PvP, les récompenses de guilde, et les events. L'équilibre entre sinks et faucets est ajusté en continu via analytics pour maintenir une économie saine.

### Intégration des paiements natifs (IAP)

**SDK natifs obligatoires :**
Les achats in-app passent obligatoirement par les systèmes de paiement natifs des stores : StoreKit 2 pour iOS (App Store) et Google Play Billing Library pour Android (Play Store). L'utilisation de Stripe ou de tout autre processeur de paiement tiers est interdite par les politiques des stores pour les achats de biens virtuels (spins, coins, gems). La bibliothèque react-native-iap (ou expo-in-app-purchases) est utilisée pour abstraire les deux SDK et offrir une API unifiée côté React Native.

**Commission des stores :**
Apple et Google prélèvent une commission de 15% (pour les développeurs gagnant moins de 1M$/an, programme Small Business) ou 30% au-delà. Les prix des packs sont donc calibrés en tenant compte de cette commission. Les abonnements (VIP Pass) bénéficient d'une commission réduite à 15% après la première année d'abonnement d'un utilisateur.

**Validation des achats côté serveur :**
Chaque achat est validé côté serveur via les API de validation des stores (App Store Server API pour Apple, Google Play Developer API pour Google). Le client envoie le reçu d'achat au serveur Supabase Edge Function, qui vérifie l'authenticité du reçu auprès du store, puis crédite les ressources au joueur en transaction atomique. Cette validation empêche les achats frauduleux (reçus falsifiés, achats annulés après crédit). Les reçus sont stockés dans une table `purchase_history` pour audit.

**Gestion des abonnements :**
Le VIP Pass est un abonnement auto-renouvelable géré nativement par les stores. Le serveur vérifie quotidiennement le statut des abonnements via les notifications serveur (App Store Server Notifications v2, Google Play Real-time Developer Notifications). En cas d'expiration, de résiliation, ou de problème de paiement, les avantages VIP sont automatiquement désactivés. Le joueur reçoit une notification in-app l'informant de l'expiration avec un bouton de réabonnement.

### Boutique in-app

**Packs de spins :**
La boutique offre 4 tiers de packs de spins avec des bonus croissants pour inciter les gros achats. Le petit pack (0.99€, 50 spins) n'a pas de bonus et sert de "starter" pour convertir les joueurs hésitants. Le pack moyen (2.99€, 200+20 spins bonus) offre 10% de bonus. Le pack large (4.99€, 500+100 spins) offre 20% de bonus. Le pack mega (9.99€, 1500+500 spins) offre 33% de bonus et est étiqueté "BEST VALUE" en orange fluo. Ces prix sont calibrés pour maximiser le lifetime value sans tomber dans le "whale hunting" prédateur.

**Packs de coins :**
Similairement, des packs de coins directs sont disponibles pour les joueurs qui veulent skip le grinding du slot. Les prix suivent la même structure que les packs de spins avec des bonus similaires. Cependant, les packs de spins sont marketés plus agressivement car ils encouragent plus d'engagement (jouer au slot) plutôt que de simplement acheter la progression.

**Bundles limités :**
Des bundles spéciaux apparaissent régulièrement avec des valeurs exceptionnelles. Le Starter Pack (0.99€ au lieu de 4.99€) est offert une seule fois aux nouveaux joueurs dans leurs premières 48 heures et contient 100 spins, 100k coins, 5 shields, et un coffre de cartes. Le Weekend Mega Deal (9.99€) apparaît chaque weekend et offre 500 spins, 1M coins, 50 gems, et 3 coffres pour le prix d'un pack mega normal. Ces offres créent un sentiment d'urgence et augmentent les conversions.

### Système de gems

**Acquisition de gems gratuits :**
Les gems sont la monnaie premium mais les joueurs gratuits peuvent en gagner régulièrement. Compléter un district donne 5 gems, monter de tier de ligue donne 10 gems, les achievements donnent 5-50 gems selon la difficulté, compléter un set de cartes donne 10 gems, et regarder une vidéo publicitaire donne 5 gems (max 5 fois par jour). Un joueur actif peut gagner environ 100-200 gems par mois gratuitement, suffisant pour acheter quelques coffres de cartes ou refresh des cibles PvP.

**Utilisations stratégiques des gems :**
Les gems peuvent être dépensés pour de multiples utilisations : acheter des spins (10 gems = 10 spins, ratio moins bon que les packs cash pour inciter les achats réels), acheter des shields (10 gems = 1 shield, 40 gems = 5 shields), acheter des coffres de cartes (10/50/200 gems selon la taille), refresh les cibles PvP (10 gems), créer une guilde (100 gems), et acheter des cosmétiques (avatars à 20-100 gems, changement de nom à 50 gems). Cette variété d'utilisations assure que tous les types de joueurs trouvent de la valeur dans les gems.

### VIP Pass

**Modèle d'abonnement :**
Le VIP Pass coûte 9.99€ par mois et offre des bénéfices continus pendant 30 jours. Le bonus quotidien de spins passe de 20 à 50 spins (+150% d'energy passive). Le joueur reçoit 100,000 coins gratuits chaque jour en se connectant. Un coffre de cartes garanti est donné chaque semaine. Toutes les publicités sont retirées (si le jeu en contient). Un avatar exclusif VIP est débloqué pendant la durée de l'abonnement. Les donations de guilde ont un multiplicateur de 1.2x (donner 5 spins en donne 6 au receveur). Ces avantages sont significatifs pour les joueurs engagés mais ne créent pas un déséquilibre massif face aux non-VIP.

**Psychologie de l'abonnement :**
Le modèle d'abonnement génère un revenu récurrent prévisible et transforme la relation avec le jeu. Un joueur qui paie un abonnement mensuel se sent "investi" et est plus susceptible de continuer à jouer pour "rentabiliser" son achat. Le taux de churn des abonnés est beaucoup plus bas que celui des non-payeurs car ils ont une raison financière de rester. L'abonnement crée aussi un sentiment de "VIP membership" qui flatte l'ego et encourage le statut social visible (avatar exclusif).

### Publicités vidéo (optionnel)

**Rewarded ads :**
Si le jeu intègre des publicités, elles sont strictement opt-in et rewarded. Les joueurs peuvent regarder une vidéo de 30 secondes pour recevoir 5 spins, 10,000 coins, ou 5 gems. Il y a un cooldown de 1-2 heures entre chaque ad et un maximum de 10 ads par jour. Ces limitations évitent le "ad grinding" où les joueurs passent des heures à regarder des ads, ce qui dégrade l'expérience et la perception de qualité du jeu. Les ads sont positionnées comme des bonus optionnels, jamais comme une nécessité.

**Interstitial ads (à éviter) :**
Les ads interstitielles non-skip qui interrompent le gameplay sont extrêmement mal perçues et réduisent drastiquement la rétention. Si elles sont utilisées, elles doivent être extrêmement rares (1 toutes les 5+ minutes), jamais pendant un moment critique (jamais pendant un spin ou une attaque), et les joueurs VIP doivent en être exempts. Idéalement, le jeu se monétise suffisamment via les IAP et l'abonnement pour éviter complètement les interstitials, préservant une expérience premium.

### Livrables Phase 8
À la fin de cette phase, l'économie du jeu est finement équilibrée. Les joueurs gratuits ont une expérience satisfaisante et compétitive. Les joueurs payants obtiennent une valeur claire pour leur argent sans "acheter la victoire". Les métriques d'ARPU (Average Revenue Per User) et de conversion sont dans les standards de l'industrie. Le jeu est prêt pour une monétisation durable.

---

## PHASE 9 : EVENTS & RÉTENTION (Semaine 20)

### Objectifs
Créer des mécanismes de rétention qui ramènent les joueurs quotidiennement, hebdomadairement, et mensuellement. Les events injectent de la variété et de l'excitation, les quêtes quotidiennes créent une routine addictive, et les notifications push reconquièrent les joueurs qui s'éloignent.

### Events rotatifs

**Double Coins Weekend :**
Tous les deux weekends, un event Double Coins est activé pendant 48 heures. Tous les coins gagnés via le slot sont multipliés par deux, rendant la progression deux fois plus rapide. Cet event est annoncé 24 heures à l'avance via notification push et messages in-game. Les joueurs planifient souvent de "grind" pendant cet event, stockant leur énergie et leurs spins bonus pour maximiser les gains. Le Double Coins Weekend crée des pics d'engagement prévisibles et mesurables.

**Raid Frenzy :**
Chaque semaine, un event Raid Frenzy de 24 heures rend tous les raids gratuits (ne consomment pas de spins) et augmente les récompenses de 50%. Pendant cet event, le PvP devient frénétique alors que les joueurs attaquent et raidaient agressivement sans coût. Les victimes reçoivent des notifications en cascade, créant des chaînes de revenges interminables. Cet event booste drastiquement l'engagement et les sessions par utilisateur.

**Card Rush :**
Mensuellement, un event Card Rush de 72 heures double le taux de drop de cartes. Les coffres donnent 6 cartes au lieu de 3, et le taux de legendary passe à 2%. Les collectionneurs hardcore se connectent obsessivement pour ouvrir autant de coffres que possible. Le chat de guilde explose avec des screenshots de drops légendaires. Cet event motive fortement les joueurs à compléter des districts pour gagner des coffres, créant un boost de progression général.

**Guild Wars Weekend :**
Mensuellement, un weekend est désigné Guild Wars Weekend. Toutes les guildes de niveau suffisant sont automatiquement matchées dans des guerres, et les récompenses de guerre sont doublées. Ce format transforme un weekend normal en un event majeur où les guildes se mobilisent, les leaders planifient des stratégies, et la compétition atteint son paroxysme. Les guildes inactives se réveillent, et les membres se reconnectent pour ne pas laisser tomber leur équipe.

**Battle Pass saisonnier :**
Chaque saison (30 jours) introduit un Battle Pass avec 50 tiers de récompenses. La track gratuite donne des récompenses décentes (coins, spins, quelques gems), tandis que la track premium (9.99€) donne des récompenses premium (beaucoup de gems, des cartes legendaries, des avatars exclusifs, des titres uniques). Les joueurs progressent dans le Battle Pass en complétant des défis spécifiques et en jouant activement. Ce système crée une méta-progression parallèle qui motive l'engagement continu pendant toute la saison.

### Quêtes quotidiennes

**Système de quêtes :**
Chaque jour, les joueurs reçoivent 3 quêtes aléatoires parmi un pool de 20+ possibles. Les quêtes incluent des objectifs variés : "Spin the slot 50 times" (récompense : 25k coins + 100 XP), "Successfully attack 5 players" (récompense : 10 spins + 150 XP), "Upgrade 3 buildings" (récompense : 50k coins + 2 gems + 200 XP), "Donate to guild members 5 times" (récompense : 5 gems + 100 XP). Les quêtes se renouvellent chaque jour à minuit heure locale, créant une raison de se connecter quotidiennement.

**Design des quêtes :**
Les quêtes sont conçues pour encourager tous les aspects du jeu sans forcer des actions contre-intuitives. Elles nécessitent entre 5 et 30 minutes pour être complétées, s'alignant avec la durée de session cible. Les récompenses sont calibrées pour être désirables sans être essentielles, évitant la frustration des joueurs qui ne peuvent pas se connecter certains jours. Les quêtes créent une structure et un sentiment d'accomplissement même pendant les sessions sans progression majeure (par exemple, jours où on n'a pas assez de coins pour un upgrade).

**Streak et bonus :**
Compléter toutes les quêtes quotidiennes plusieurs jours consécutifs donne des bonus cumulatifs. 3 jours de suite : bonus de 10,000 coins. 7 jours de suite : bonus de 50 spins. 30 jours de suite : bonus de 50 gems et un titre "Dedicated". Ces streaks encouragent fortement la connexion quotidienne et créent une anxiété de briser le streak (loss aversion), un puissant motivateur psychologique.

### Achievements

**Système d'achievements :**
Le jeu lance avec 500+ achievements couvrant tous les aspects du jeu. Les achievements ont plusieurs tiers : "Earn 100,000 coins total" (tier 1, récompense : 5 gems), "Earn 1,000,000 coins total" (tier 2, récompense : 10 gems), "Earn 10,000,000 coins total" (tier 3, récompense : 25 gems), "Earn 100,000,000 coins total" (tier 4, récompense : 50 gems + titre "Millionaire"). Cette structure en tiers crée une progression continue et des surprises régulières alors que les joueurs débloquent naturellement des achievements en jouant.

**Catégories d'achievements :**
Les achievements sont organisés en catégories : Economie (coins earned, coins spent, gems earned), Combat (attacks won, raids successful, revenges taken, win streaks), Construction (districts completed, buildings upgraded, specific district themes completed), Collection (cards collected, sets completed, legendary cards), Social (friends invited, gifts sent, guild donations, guild wars participated), et Mastery (level reached, days played, total spins). Cette diversité assure que tous les styles de jeu sont récompensés et que tous les joueurs progressent dans certaines catégories.

**Visibilité et célébration :**
Débloquer un achievement déclenche une popup célébratoire avec animation, son épique, et affichage de la récompense. Les achievements débloqués apparaissent dans le profil du joueur, affichables à tous. Les achievements rares et difficiles donnent des titres uniques qui s'affichent à côté du nom du joueur dans toutes ses interactions, créant un statut social et une reconnaissance par les pairs. Les top players sont identifiables par leurs titres impressionnants.

### Notifications push stratégiques

**Triggers comportementaux :**
Le système de notifications utilise une logique sophistiquée pour maximiser les reconversions. Lorsqu'un joueur a son énergie pleine (50/50 spins), une notification est envoyée après 30 minutes d'inactivité : "Your energy is full! Don't waste it, come spin! 🎰". Lorsqu'un joueur est attaqué, une notification immédiate est envoyée : "[Username] stole 50,000 coins from you! Take your revenge! ⚔️". Lorsqu'un ami envoie un cadeau, notification immédiate : "[Friend] sent you 5 spins! 🎁". Lorsqu'un event commence, notification : "Double Coins Weekend is live! 🎉".

**Reconquête d'inactifs :**
Si un joueur ne se connecte pas pendant 24 heures, une notification douce est envoyée : "Your guild misses you! Come back for free spins! 💎". Après 48 heures, une notification plus aggressive avec une offre : "We miss you! Claim 50 FREE spins + 100K coins as a comeback gift! 🎁". Après 7 jours, une dernière notification dramatique : "Your enemies are taking over! Don't let them win! Come back now!". Ces notifications sont A/B testées pour maximiser le taux de reconversion.

**Respect de l'utilisateur :**
Malgré l'aggressivité marketing des notifications, le système respecte des limites strictes pour ne pas spammer. Maximum 5 notifications par jour. Aucune notification entre 23h et 8h heure locale (respect du sommeil). Les joueurs peuvent granulariser quelles notifications ils reçoivent (certains veulent les attaques mais pas les events). Les joueurs qui désactivent toutes les notifications ne sont jamais re-sollicités. Ce respect maintient une relation positive avec le jeu et évite les désinstallations par frustration.

### Livrables Phase 9
À la fin de cette phase, Kingdom Clash possède un moteur de rétention puissant. Les events créent de l'excitation régulière. Les quêtes quotidiennes établissent une routine. Les achievements récompensent la progression long-terme. Les notifications reconquièrent efficacement les joueurs qui s'éloignent. Les métriques de rétention D1/D7/D30 atteignent ou dépassent les benchmarks de l'industrie.

---

## PHASE 10 : POLISH & LAUNCH (Semaines 21-24)

### Objectifs
Transformer le jeu fonctionnel en un produit premium prêt pour le marché. Cette phase se concentre sur le polish visuel et audio, l'optimisation des performances, la création d'un tutorial efficace, le testing exhaustif, et la préparation d'une stratégie de lancement.

### Onboarding et FTUE (First Time User Experience)

**Tutorial interactif :**
Le tutorial commence immédiatement après la création de compte, sans murs de texte. Le jeu guide le joueur à travers les actions essentielles en 5 étapes : (1) Taper pour spin le slot pour la première fois (récompense : 1000 coins), (2) Utiliser les coins pour upgrade le premier bâtiment (HQ forcé, récompense : 10 spins), (3) Spinner automatiquement jusqu'à compléter le premier district (le jeu gère l'auto-spin, récompense : 10 gems + coffre de cartes), (4) Lancer la première attaque PvP (cible fournie, récompense : 3 shields), (5) Optionnellement rejoindre ou créer une guilde. Durée totale : 3-5 minutes.

**Progressive disclosure :**
Le tutorial n'overwhelm pas le joueur avec toutes les features à la fois. Le système de cartes n'est expliqué qu'après avoir ouvert le premier coffre. Les guildes ne sont mentionnées qu'au niveau 5. Les ligues ne sont expliquées qu'après 50 attaques PvP. Cette révélation progressive maintient la courbe d'apprentissage accessible et évite la paralysie de décision. Chaque nouvelle feature est introduite avec une popup explicative brève et un highlight visuel de 3 secondes.

**Récompenses généreuses :**
Le tutorial donne des récompenses très généreuses pour accrocher le joueur : au total, le tutorial donne 10,000 coins, 20 spins, 10 gems, 1 coffre de cartes, et 3 shields. Ces ressources permettent au joueur de progresser rapidement dans les premiers districts, créant un sentiment de puissance et de progression rapide (le "honeymoon period"). Ce boost initial transforme les joueurs curieux en joueurs engagés avant que la progression ne ralentisse naturellement.

### Optimisations de performance

**Target de 60 FPS constant :**
Le jeu doit tourner à 60 FPS même sur des devices mid-range de 2-3 ans. Cela nécessite des optimisations agressives : utilisation de React Native Reanimated pour les animations sur le thread UI natif (pas le thread JavaScript), optimisation des listes avec FlashList au lieu de FlatList pour les longues listes (leaderboards, inventaire), utilisation du moteur Hermes pour un démarrage rapide et une consommation mémoire réduite, lazy loading des écrans non visibles via React Navigation lazy, et optimisation des images avec des caches locaux (expo-image).

**Réduction du bundle size :**
Le bundle initial de l'app doit rester sous 50 MB pour faciliter le téléchargement sur les stores. Les stratégies incluent : utiliser WebP pour les images d'illustration des districts (30% plus léger que PNG), utiliser des SVG pour les icônes d'interface, lazy loader les assets des districts non encore atteints (téléchargement à la demande), optimiser les fichiers audio (compression OGG/AAC), et utiliser Hermes comme moteur JavaScript pour React Native (réduction de 50% de la mémoire et démarrage plus rapide).

**Optimisations spécifiques mobile :**
Les optimisations natives incluent : désactiver les animations complexes sur devices bas de gamme (détection automatique via les caractéristiques du device), utiliser des illustrations lower-res pour les devices à faible RAM, réduire le nombre de particules dans les effets selon la puissance du device, implémenter un système de pooling pour les composants de liste via FlatList/FlashList, et optimiser les re-renders avec React.memo et useMemo pour maintenir 60 FPS constant.

**Gestion de la connexion :**
Le jeu nécessite une connexion internet permanente pour garantir la sécurité et l'intégrité des données (toutes les actions sont validées serveur-side). En cas de perte de connexion, un overlay semi-transparent s'affiche avec un message "Connexion perdue - Reconnexion en cours..." et un spinner animé. Le système tente automatiquement de se reconnecter toutes les 3 secondes. Dès que la connexion revient, l'overlay disparaît et le jeu reprend exactement où il en était. Si la déconnexion survient pendant un spin ou une action critique, l'état est réconcilié avec le serveur à la reconnexion (le résultat du spin est déjà calculé serveur-side). Un bouton "Réessayer" permet au joueur de forcer une tentative de reconnexion manuelle.

### Polish visuel et audio

**Animations de micro-interactions :**
Chaque interaction possède un feedback visuel immédiat. Les boutons ont un effet de squash & stretch au tap, les cartes ont un effet de flip 3D smooth lors de la révélation, les coins ont une animation de vol vers le compteur en haut de l'écran, les confettis explosent lors des accomplissements, les particules dorées accompagnent chaque gain, et les transitions entre écrans utilisent des slides ou fades naturels. Ces micro-animations transforment l'interface d'une collection de boutons en une expérience vivante et satisfaisante.

**Sound design holistique :**
Chaque action a un son distinctif : le spin démarre avec un roulement de tambour, chaque rouleau qui s'arrête fait "clunk", les coins qui tombent font "bling bling bling", les attaques font "BOOM", les shields qui bloquent font "DING", la construction de bâtiments fait un son de marteau puis une fanfare, les cartes qui se révèlent font un son magique "whoosh", et les level-ups font une explosion épique. Les sons sont mixés professionnellement pour avoir un volume cohérent et des fréquences équilibrées.

**Thèmes musicaux :**
Chaque district possède une musique d'ambiance loopable de 2-3 minutes. Le menu principal a une musique épique et entraînante. Les combats PvP ont une musique tendue et percussive. Les moments de célébration (district complété, set de cartes complété) ont des fanfares triomphales. La musique s'adapte dynamiquement : le volume baisse légèrement pendant les dialogues, elle accélère pendant les moments d'action, et elle fusionne smoothly lors des transitions. Les joueurs peuvent ajuster le volume de la musique et des effets sonores indépendamment.

### Localisation et internationalisation (i18n)

**Architecture multi-langues :**
Le système i18n utilise la bibliothèque i18next avec react-i18next pour gérer les traductions dans React Native. Toutes les chaînes de texte de l'interface sont externalisées dans des fichiers JSON par langue, organisés par namespace (common, slot, pvp, guild, shop, notifications). Le système supporte le pluriel, le formatage des nombres selon la locale (1,000 vs 1.000), et le formatage des dates. Le changement de langue est instantané sans rechargement de page grâce au système de bundles dynamiques.

**Langues supportées au lancement :**
Le soft launch cible les marchés anglophones, donc l'anglais (en) est la langue par défaut. Le français (fr) est la deuxième langue prioritaire (marché francophone). L'espagnol (es), le portugais brésilien (pt-BR), et l'allemand (de) sont ajoutés avant le lancement global. Chaque traduction est réalisée par des traducteurs natifs (pas de traduction automatique) pour garantir la qualité et le ton approprié pour un jeu (informal, dynamique, fun). Les textes du slot machine et des notifications push sont particulièrement soignés car ils impactent directement l'engagement.

**Adaptation culturelle :**
Au-delà de la traduction pure, certains éléments sont adaptés culturellement : les noms des districts peuvent varier selon la langue, les formats de prix dans la boutique respectent les conventions locales (€, $, R$), les horaires des events sont ajustés par fuseau horaire, et les notifications push respectent les jours fériés locaux. Les images et icônes sont culture-neutral pour éviter les problèmes de localisation visuelle.

### Accessibilité

**Conformité aux standards :**
Le jeu respecte les guidelines WCAG 2.1 niveau AA pour l'accessibilité web. Le contraste des couleurs entre le texte et l'arrière-plan est au minimum de 4.5:1 pour le texte normal et 3:1 pour le texte large. Tous les éléments interactifs ont une taille minimale de 44x44px pour faciliter le tap sur mobile. Les animations peuvent être réduites ou désactivées via le setting "Reduce Motion" qui respecte aussi la préférence système `prefers-reduced-motion`.

**Support des lecteurs d'écran :**
Tous les éléments d'interface possèdent des propriétés d'accessibilité React Native appropriées (accessibilityLabel, accessibilityRole, accessibilityHint). Les images et icônes ont des descriptions pour VoiceOver (iOS) et TalkBack (Android). Les résultats de spin sont annoncés vocalement via AccessibilityInfo.announceForAccessibility ("Vous avez obtenu : Coins, Attack, Shield. Gain : 500 coins"). Les boutons ont des labels explicites. La navigation respecte l'ordre logique de lecture.

**Options d'accessibilité in-game :**
Les settings du jeu incluent une section Accessibilité avec : taille du texte ajustable (normal, large, extra-large), mode daltonien (les symboles du slot utilisent des formes distinctives en plus des couleurs), réduction des animations (désactive particules, shake, et flashs), mode contraste élevé (bordures plus marquées, backgrounds opaques au lieu du glassmorphism), et vitesse des animations ajustable (lent, normal, rapide). Ces options permettent à un public plus large de profiter du jeu.

### Conformité légale

**RGPD et protection des données (obligatoire pour l'UE) :**
Le jeu collecte des données personnelles (email, adresse IP, données de jeu, historique d'achats) et doit respecter le RGPD. Au premier lancement, un bandeau de consentement clair est affiché avec deux options : "Accepter" et "Paramétrer mes choix". Les cookies analytiques (PostHog) et publicitaires ne sont activés qu'après consentement explicite. Les joueurs peuvent à tout moment : consulter leurs données personnelles (export JSON), demander la suppression de leur compte (effectuée sous 30 jours), retirer leur consentement pour les analytics, et modifier leurs préférences de communication. Un DPO (Data Protection Officer) ou un responsable désigné gère les demandes RGPD.

**Conditions Générales d'Utilisation (CGU) :**
Les CGU couvrent : les règles du jeu (ce qui est interdit : triche, multi-comptes, échanges d'argent réel), la politique de monétisation (achats in-app non remboursables sauf obligation légale, description claire de ce que les joueurs achètent), les droits de propriété intellectuelle (tout le contenu du jeu appartient à l'éditeur, les joueurs ont une licence d'utilisation), la limitation de responsabilité, et les conditions de suspension/bannissement de compte. Les CGU sont accessibles depuis les settings et doivent être acceptées à la création du compte.

**Politique de confidentialité :**
Un document séparé détaille : quelles données sont collectées et pourquoi, comment elles sont stockées (chiffrement at rest dans Supabase, hébergement UE si possible), avec qui elles sont partagées (Apple/Google pour les paiements IAP, PostHog pour les analytics, OneSignal pour les notifications), combien de temps elles sont conservées, et les droits des utilisateurs. Ce document est rédigé dans un langage accessible (pas uniquement du jargon juridique) et est disponible dans toutes les langues supportées.

**Obligations spécifiques aux achats in-app :**
Pour la France et l'UE : affichage clair des prix TTC, droit de rétractation de 14 jours pour les achats non consommés, facturation conforme, et mention "Achats intégrés" sur les stores. Pour les mineurs : un avertissement parental est recommandé, les achats au-dessus de 50€ nécessitent une double confirmation, et un plafond de dépense mensuel optionnel peut être activé dans les settings parentaux. Les loot boxes (coffres de cartes) affichent les probabilités de drop conformément aux régulations de l'App Store et du Google Play Store.

**Mentions légales :**
L'écran "À propos" affiche : le nom légal de l'éditeur, l'adresse du siège, le numéro SIRET (si entreprise française), l'email de contact, le numéro de version du jeu, et les crédits des technologies tierces utilisées (licences open source).

### Infrastructure et opérations

**Stratégie de backup de la base de données :**
Supabase fournit des backups automatiques quotidiens sur le plan Pro. En complément, un backup programmatique est configuré via un cron job qui exporte un dump PostgreSQL complet toutes les 6 heures vers un bucket S3 séparé (ou Supabase Storage dans un projet dédié). Les backups sont conservés selon une politique de rétention : backups horaires pendant 24h, quotidiens pendant 30 jours, hebdomadaires pendant 6 mois, mensuels pendant 2 ans. Un test de restauration est effectué mensuellement pour vérifier l'intégrité des backups. Un runbook documenté décrit la procédure de restauration complète en cas de catastrophe.

**Versioning et migrations de base de données en production :**
Les migrations de schéma DB sont gérées via des fichiers SQL versionnés et numérotés séquentiellement dans `supabase/migrations/`. Chaque migration est idempotente (peut être rejouée sans erreur) et inclut un rollback possible. En production, les migrations sont appliquées via la CLI Supabase pendant les fenêtres de maintenance annoncées. Pour les changements non-breaking (ajout de colonne nullable, nouvel index), les migrations sont appliquées sans downtime. Pour les changements breaking (renommage de colonne, suppression de table), une stratégie en trois étapes est utilisée : (1) ajouter la nouvelle structure en parallèle, (2) migrer les données et le code pour utiliser la nouvelle structure, (3) supprimer l'ancienne structure après vérification. Un système de feature flags permet de déployer du code qui supporte l'ancienne et la nouvelle structure simultanément pendant la transition.

**Monitoring et alerting :**
Sentry capture toutes les erreurs frontend et backend avec le contexte complet (stack trace, device info, user ID, action en cours). Des alertes sont configurées pour : taux d'erreur supérieur à 1% (warning) ou 5% (critique), temps de réponse API supérieur à 500ms (warning) ou 2s (critique), nombre de joueurs actifs en chute de plus de 30% par rapport à la même heure la veille, et échec de paiement IAP en série. PostHog monitore les métriques business en temps réel avec des dashboards partagés.

### Support client

**Système de tickets in-app :**
Un bouton "Aide & Support" est accessible depuis les settings et depuis chaque écran du jeu (via un menu contextuel). Le joueur peut soumettre un ticket en choisissant une catégorie (problème de paiement, bug technique, signalement de joueur, question sur le jeu, demande de suppression de compte) et en décrivant son problème. Chaque ticket inclut automatiquement les métadonnées du joueur (ID, device, version de l'app, OS, dernier spin, dernière action) pour faciliter le diagnostic. Le joueur reçoit un numéro de ticket et peut suivre l'état de sa demande dans un écran "Mes tickets".

**FAQ et aide automatisée :**
Avant de créer un ticket, le joueur voit une section FAQ dynamique avec les 10 questions les plus fréquentes (comment récupérer mon compte, comment annuler un abonnement, comment signaler un joueur, etc.). Les réponses sont rédigées clairement et mises à jour régulièrement. Si le joueur ne trouve pas sa réponse, il peut créer un ticket. Ce système de déflexion réduit le volume de tickets de 40-60% et permet de se concentrer sur les problèmes réels.

**Délais de réponse :**
Les tickets sont traités avec des SLA définis par catégorie : problème de paiement (réponse sous 24h, priorité haute), bug bloquant (réponse sous 24h), signalement de joueur (réponse sous 48h), question générale (réponse sous 72h). Les joueurs VIP bénéficient d'un SLA réduit de moitié. Les réponses sont envoyées par notification push et par email, et le joueur peut répondre directement dans le chat du ticket.

### Testing exhaustif

**Testing fonctionnel :**
Une checklist de 100+ tests fonctionnels est complétée : le slot machine génère des résultats équitables (vérification du RNG), les calculs de coins sont précis (pas de duplication ni de perte), le matchmaking PvP fonctionne correctement, le chat de guilde est en temps réel sans lag, les achats sont processés et les ressources livrées, les récompenses sont distribuées correctement après events, et les notifications push arrivent au bon moment. Chaque bug critique est loggé et fixé avant de passer au testing suivant.

**Testing de performance :**
Des tests de charge sont effectués pour assurer que le backend tient sous charge : simulation de 10,000 joueurs concurrents, vérification que les API responses restent sous 100ms, monitoring de l'utilisation CPU/RAM du serveur, vérification qu'il n'y a pas de memory leaks, et test de la scalabilité horizontale. Les bottlenecks sont identifiés et optimisés. Le système est configuré pour auto-scale automatiquement si le nombre de joueurs explose.

**Testing de sécurité :**
Des tests de sécurité sont cruciaux pour éviter les exploits : vérification que le système anti-cheat détecte les hacks communs (speed hacks, memory editors), protection contre les SQL injections via parameterized queries, protection XSS via sanitization des inputs, rate limiting sur toutes les APIs sensibles pour empêcher le spam, et validation côté serveur de toutes les actions critiques (jamais faire confiance au client). Un bug bounty peut être lancé en soft launch pour identifier des vulnérabilités avant le lancement global.

**Testing UX :**
Des sessions de playtesting sont organisées avec 20-50 utilisateurs naïfs (qui n'ont jamais vu le jeu). On observe où ils bloquent, quelles features ils ne comprennent pas, et ce qu'ils trouvent frustrant. Le tutorial est itéré jusqu'à ce que 80%+ des testeurs le complètent sans aide. Les points de friction sont identifiés et smooth. Le feedback est intégré rapidement dans des itérations successives.

### Soft launch

**Stratégie de soft launch :**
Le jeu est lancé dans 2-3 petits marchés anglophones (Canada, Australie, Nouvelle-Zélande) pour 2-4 semaines. L'objectif n'est pas de générer du revenu mais de valider les métriques clés : rétention D1 > 40%, rétention D7 > 20%, rétention D30 > 10%, conversion (% qui payent) > 2%, ARPU > $0.50, session length 8-12 minutes, crash rate < 1%, et rating app stores > 4.0. Si ces métriques sont atteintes, le jeu est prêt pour le lancement global. Sinon, des itérations sont faites pour améliorer les métriques faibles.

**Itérations rapides :**
Pendant le soft launch, l'équipe monitore les analytics 24/7. Des updates sont poussés fréquemment (tous les 2-3 jours) pour fixer des bugs critiques et améliorer la retention. Des A/B tests sont effectués sur des éléments clés : prix de la boutique, récompenses du tutorial, difficulté de progression, fréquence des events. Les variations gagnantes sont gardées, les perdantes sont abandonnées. L'objectif est d'atteindre un "product-market fit" mesurable avant d'investir dans le marketing global.

**Feedback et community management :**
Un Discord ou un subreddit est créé pour les early adopters. L'équipe interagit directement avec les joueurs, recueille leurs feedbacks, répond à leurs questions, et les fait sentir valorisés. Les meilleurs feedbacks sont implementés rapidement et les joueurs sont crédités, créant des ambassadeurs enthousiastes. Cette community devient la base de fans hardcore qui défendront le jeu lors du lancement global et créeront du contenu organique (vidéos YouTube, posts Reddit).

### Lancement global

**Marketing et acquisition :**
Avec des métriques validées, le budget marketing est déployé. Phase 1 cible les marchés anglophones premium (US, UK, Canada) avec 5,000€-10,000€ de budget sur Facebook Ads, TikTok Ads, et partnerships avec micro-influenceurs gaming. Les créatives mettent en avant les moments les plus satisfaisants : gros wins au slot, attaques PvP épiques, construction de districts, collection de cartes. Les vidéos sont courtes (15-30 secondes), percutantes, et finissent par un call-to-action clair.

**App Store Optimization (ASO) :**
Le jeu est optimisé pour les app stores : icon attrayant (testé avec plusieurs variants), screenshots qui montrent le meilleur du gameplay, vidéo de preview de 30 secondes, description claire avec keywords, et encouragement des reviews positives via prompts in-game après des moments positifs. Un bon ASO peut réduire le coût d'acquisition de 30-50% en améliorant la conversion organique.

**PR et influenceurs :**
Le jeu est soumis aux sites de review mobile gaming (TouchArcade, Pocket Gamer). Des press kits sont envoyés avec screenshots, trailer, et informations de contact. Des partnerships sont négociés avec des micro-influenceurs (10k-100k followers) qui reçoivent des codes promo pour leurs audiences. Des posts organiques sont faits sur Reddit dans r/AndroidGaming et r/iosgaming. Un lancement sur Product Hunt peut générer des milliers de downloads organiques.

**Cross-promotion :**
Des deals de cross-promotion sont négociés avec d'autres jeux mobiles de taille similaire. "Si tu aimes notre jeu, essaye [AutreJeu]!" Les deux jeux se promeuvent mutuellement, partageant leurs audiences. Cette stratégie low-cost peut générer des milliers d'installs sans dépenses publicitaires.

### Post-launch et live ops

**Calendrier d'updates :**
Après le lancement, un calendrier strict de live ops est maintenu. Quotidiennement : nouveaux daily quests, rotation de la boutique, monitoring des events. Hebdomadairement : nouveau boss de guilde, distribution de récompenses de tournament, reset de leaderboards, nouvelles offres spéciales. Mensuellement : nouveaux districts (1-2), nouveaux sets de cartes (1), balance patches, nouvelles features, reset de saison. Trimestriellement : major content updates (nouveaux modes de jeu, expansions majeures). Cette cadence maintient le jeu frais et donne aux joueurs des raisons de revenir.

**Community management continu :**
L'équipe reste active sur Discord, Reddit, et les réseaux sociaux. Les questions sont répondues rapidement, les bugs sont reconnus et trackés publiquement, les suggestions populaires sont discutées et parfois implementées. Les top players sont célébrés dans des spotlights mensuels. Des contests sont organisés (meilleur screenshot, meilleure guilde, etc.) avec des prix in-game. Cette présence active crée une communauté loyale et engagée.

**Roadmap publique :**
Une roadmap des 3-6 prochains mois est partagée publiquement pour exciter les joueurs sur le futur. Les features à venir incluent : système de pets (compagnons avec abilities passives), territories de clans (conquest d'une carte), mode campagne PvE (missions avec storyline), tournaments live (bracketed real-time), customisation avancée des districts, marketplace de trading (auction house), mode esports (spectateur, replays), progression cross-platform, skins saisonniers, et mini-games hub. Cette transparence crée de l'anticipation et montre que le jeu a un futur long-terme.

### Livrables Phase 10
À la fin de cette phase, Kingdom Clash est un produit premium, polished, et prêt pour le marché. Le tutorial converti efficacement les nouveaux joueurs. Les performances sont optimales. Le jeu est exhaustivement testé et stable. Le soft launch a validé les métriques clés. Le lancement global est préparé avec une stratégie marketing claire. Le jeu est prêt à conquérir le marché du mobile gaming social.

---

## MÉTRIQUES DE SUCCÈS ET KPIS

### Objectifs Année 1
À la fin de la première année, les objectifs réalistes pour Kingdom Clash sont d'atteindre 100,000 joueurs actifs mensuels avec des métriques de rétention solides : 45% de rétention D1, 22% de rétention D7, et 12% de rétention D30. Le taux de conversion (pourcentage de joueurs qui effectuent au moins un achat) devrait atteindre 3%, avec un ARPU (Average Revenue Per User) de $0.80 et un ARPPU (Average Revenue Per Paying User) de $26.70. Ces métriques généreraient un revenu mensuel d'environ $80,000, soit $960,000 annuellement.

### Projections Année 2
Après optimisations continues et croissance organique, les objectifs pour l'année 2 sont d'atteindre 500,000 joueurs actifs mensuels avec des métriques de rétention similaires ou légèrement améliorées. Le revenu mensuel projeté serait d'environ $400,000, soit $4.8M annuellement. Cette croissance serait alimentée par le bouche-à-oreille, l'amélioration continue des mécaniques de rétention, et l'ajout de nouvelles features qui enrichissent le jeu.

### Benchmarks de l'industrie
Les benchmarks typiques pour les jeux mobile casual sont : rétention D1 de 35-45%, rétention D7 de 15-25%, rétention D30 de 8-15%, taux de conversion de 2-5%, ARPU de $0.50-$2.00, et LTV (Lifetime Value) de $3-$10. Kingdom Clash vise le haut de ces fourchettes grâce à ses mécaniques sociales fortes et sa boucle de gameplay addictive.

### Analytics et outils de mesure
PostHog est utilisé pour tracker toutes les métriques comportementales : événements de jeu, funnels de conversion, rétention cohorts, et heatmaps d'interaction. Sentry monitore les crashes et erreurs en production. Des dashboards en temps réel affichent les KPIs critiques : joueurs actifs, sessions par utilisateur, revenus journaliers, taux de conversion, performance technique. Ces données guident toutes les décisions produit et permettent d'itérer rapidement vers le succès.

---

## RÉCAPITULATIF DE LA TIMELINE

Le développement complet de Kingdom Clash s'étale sur 24 semaines, soit approximativement 6 mois jusqu'au soft launch. Le jeu est développé en React Native + Expo pour un déploiement natif sur App Store et Google Play Store, avec un style visuel 2D illustré inspiré de Coin Master.

Les phases s'enchaînent logiquement : les semaines 1-5 établissent les fondations techniques (React Native + Expo, authentification multi-méthodes, profil joueur, design system) et développent le slot machine, le cœur du gameplay. Les semaines 6-8 ajoutent la progression via la construction urbaine 2D (15-20 districts au lancement), le système de niveaux (niveau = districts complétés), et l'inventaire. Les semaines 9-11 introduisent le PvP compétitif avec un système anti-triche robuste (validation 100% serveur-side, connexion permanente requise). Les semaines 12-14 développent le système d'amis, les guildes avec chat modéré, et toute la couche sociale. Les semaines 15-16 ajoutent la collection de cartes et le trading entre amis. Les semaines 17-18 implémentent les ligues et la compétition. La semaine 19 équilibre l'économie et intègre les achats in-app natifs (IAP Apple/Google, pas de Stripe). La semaine 20 ajoute les events et mécanismes de rétention. Les semaines 21-24 finalisent le polish (localisation i18n, accessibilité), la conformité légale (RGPD, CGU, politique de confidentialité), l'infrastructure (backups, monitoring, migrations DB), le support client, le testing exhaustif, et préparent le lancement sur les stores.

Cette timeline est ambitieuse mais réalisable. Chaque phase construit sur les précédentes, permettant de tester et d'itérer continuellement. Le résultat final est un jeu mobile natif complet, polished, accessible, légalement conforme, et prêt pour le marché, avec toutes les features nécessaires pour compétitionner dans le segment du mobile social gaming aux côtés de références comme Coin Master.

---

**Document créé le :** Février 2026
**Version :** 2.0 (FINALE - VERSION VERROUILLÉE)
**Auteur :** Équipe Kingdom Clash
**Dernière mise à jour :** Février 2026

**Changements v2.0 (décisions finales) :**
- Stack : React Native + Expo (app native) remplace Next.js (web)
- Visuels : 2D illustré style Coin Master remplace Three.js 3D
- Niveaux : Niveau = nombre de districts complétés (pas d'XP)
- Districts : 15-20 au lancement (ajouts en live ops)
- Paiements : IAP natifs Apple/Google (pas de Stripe)
- Connexion : Online obligatoire (sécurité prioritaire, pas de mode offline)
- Modération : Filtre automatique + outils leader/co-leader + signalements
- Support client : Tickets in-app + FAQ automatisée + SLA par catégorie
