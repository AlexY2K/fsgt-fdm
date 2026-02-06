import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import CryptoJS from 'crypto-js';
import { log } from '@/lib/logger';

const ENCRYPTION_KEY_STORE = 'fsgt_encryption_key';

/** Format: ENCv1:iv_hex:ciphertext_base64 */
const ENCRYPTED_PREFIX = 'ENCv1:';
/** Ancien format OpenSSL (CryptoJS par défaut) */
const LEGACY_ENCRYPTED_PREFIX = 'U2FsdGVkX1';

async function getOrCreateKey(): Promise<string> {
  let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORE);
  if (!key) {
    const bytes = await Crypto.getRandomBytesAsync(32);
    key = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    await SecureStore.setItemAsync(ENCRYPTION_KEY_STORE, key);
  }
  return key;
}

async function encrypt(plainText: string, keyHex: string): Promise<string> {
  const ivBytes = await Crypto.getRandomBytesAsync(16);
  const ivHex = Array.from(ivBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return `${ENCRYPTED_PREFIX}${ivHex}:${encrypted.toString()}`;
}

function decrypt(payload: string, keyHex: string): string {
  const parts = payload.slice(ENCRYPTED_PREFIX.length).split(':');
  const ivHex = parts[0];
  const cipherBase64 = parts.slice(1).join(':');
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const decrypted = CryptoJS.AES.decrypt(cipherBase64, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function isEncrypted(value: string): boolean {
  return (
    value.startsWith(ENCRYPTED_PREFIX) || value.startsWith(LEGACY_ENCRYPTED_PREFIX)
  );
}

/**
 * Stockage chiffré : clé dans SecureStore, données chiffrées en AES dans AsyncStorage.
 * Gère la migration depuis données en clair ou ancien format OpenSSL.
 */
export const encryptedStorage = {
  async getItem(key: string): Promise<string | null> {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    if (isEncrypted(raw)) {
      try {
        const encryptionKey = await getOrCreateKey();
        if (raw.startsWith(ENCRYPTED_PREFIX)) {
          return decrypt(raw, encryptionKey);
        }
        // Ancien format OpenSSL
        const bytes = CryptoJS.AES.decrypt(raw, encryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8);
      } catch (e) {
        log.error('Failed to decrypt stored data', e);
        return null;
      }
    }

    // Données legacy non chiffrées : migration
    const encryptionKey = await getOrCreateKey();
    const encrypted = await encrypt(raw, encryptionKey);
    await AsyncStorage.setItem(key, encrypted);
    return raw;
  },

  async setItem(key: string, value: string): Promise<void> {
    const encryptionKey = await getOrCreateKey();
    const encrypted = await encrypt(value, encryptionKey);
    await AsyncStorage.setItem(key, encrypted);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
