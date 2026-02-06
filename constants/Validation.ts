/** Limites de longueur pour les champs de formulaire */
export const INPUT_LIMITS = {
  /** Nom, prénom, coach, capitaine, salle */
  TEXT_SHORT: 80,
  /** Nom d'équipe */
  TEAM_NAME: 100,
  /** Numéro de licence */
  LICENCE: 20,
  /** Réclamations */
  RECLAMATIONS: 500,
  /** Signature data URL (base64) - ~400 KB max */
  SIGNATURE_DATA_URL_MAX_LENGTH: 550_000,
} as const;

/** Préfixe attendu pour une signature valide (data URL image) */
export const SIGNATURE_DATA_URL_PREFIX = 'data:image';

export function isValidSignature(dataUrl: string): boolean {
  return (
    typeof dataUrl === 'string' &&
    dataUrl.startsWith(SIGNATURE_DATA_URL_PREFIX) &&
    dataUrl.length <= INPUT_LIMITS.SIGNATURE_DATA_URL_MAX_LENGTH
  );
}
