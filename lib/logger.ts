/**
 * Logger conditionnel : logs uniquement en __DEV__ pour éviter d'exposer
 * des informations sensibles en production.
 */
export const log = {
  error: (message: string, err?: unknown) => {
    if (__DEV__) {
      console.error(message, err);
    }
  },
  warn: (message: string) => {
    if (__DEV__) {
      console.warn(message);
    }
  },
};
