/**
 * Championnats FSGT Paris - Source: https://www.volley.fsgt75.org/
 * Structure de la navigation du site (archives 2023/2024, 2024/2025)
 */

/** Volley 4x4 mixte - championnats mixtes et équimixte */
export const CHAMPIONNATS_4X4_MIXTE = [
  'Division Elite',
  'Division 1',
  'Division 2',
  'Division 3',
  'Division 4',
  'Division 5 - Groupe A',
  'Division 5 - Groupe B',
  'Division 6 - Groupe A',
  'Division 6 - Groupe B',
  'Division 7 - Groupe A',
  'Division 7 - Groupe B',
  'Équimixte 1',
  'Équimixte 2',
] as const;

/** Volley 6x6 mixte - championnats mixtes */
export const CHAMPIONNATS_6X6_MIXTE = [
  'Excellence Elite',
  'Excellence 1',
  'Excellence 2',
  'Excellence Promotion',
  'Honneur',
] as const;

/** VB féminin - championnats féminins (4x4 et 6x6) */
export const CHAMPIONNATS_VB_FEMININ = [
  'Division F Elite',
  'Division F1',
  'Division F2',
  'Division F3',
  'Division F4',
] as const;

/** Liste plate pour les feuilles de match 4x4 (sélecteur) - mixte + féminin 4x4 */
export const CHAMPIONNATS = [
  ...CHAMPIONNATS_4X4_MIXTE,
  ...CHAMPIONNATS_VB_FEMININ,
] as const;
