# FSGT FDM — Feuilles de match Volley 4×4

Application mobile pour gérer les feuilles de match de volley 4×4 (FSGT). Permet de créer, éditer et suivre le score en direct des matchs.

## Fonctionnalités

- **Feuilles de match** : création et édition complète (infos, équipes, scores, signatures, réclamations)
- **Score en direct** : modale et onglet dédié pour afficher le score aux joueurs (orientation paysage optimisée)
- **Signatures tactiles** : signature au doigt pour capitaines et arbitre
- **Auto-arbitrage** : option par défaut, masque la signature arbitre
- **Stockage sécurisé** : données chiffrées avec Expo Secure Store

## Prérequis

- Node.js 18+
- npm ou yarn
- [Expo Go](https://expo.dev/go) (pour tester sur appareil)

## Installation

```bash
git clone https://github.com/AlexY2K/fsgt-fdm.git
cd fsgt-fdm
npm install
```

## Lancement

```bash
npm start
```

Puis scanner le QR code avec Expo Go (Android) ou l’appareil photo (iOS).

## Scripts

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur Expo |
| `npm run ios` | Lance sur simulateur iOS |
| `npm run android` | Lance sur émulateur Android |
| `npm run web` | Lance la version web |
| `npm test` | Lance les tests Jest |

## Règles volley

- 25 points par set (2 points d’écart)
- Tie-break à 15 points
- Match en 3 sets gagnants

## Stack

- **Expo** (SDK 54)
- **React Native** + **Expo Router**
- **TypeScript**
- **react-native-signature-canvas**
- **expo-secure-store**

## Licence

Projet FSGT.
