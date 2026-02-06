import { useState, useEffect, useCallback, useRef } from 'react';
import { encryptedStorage } from '@/lib/encryptedStorage';
import { log } from '@/lib/logger';
import type { MatchSheet, MatchData } from '@/types/match';

const STORAGE_KEY = '@fsgt_match_sheets';

export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

function migrateSetScore(s: { a?: number | null; b?: number | null } | undefined): { a: number | null; b: number | null } {
  return {
    a: s?.a !== undefined && s?.a !== null ? s.a : null,
    b: s?.b !== undefined && s?.b !== null ? s.b : null,
  };
}

function migrateMatchData(data: MatchData): MatchData {
  const info = data.info || ({} as MatchData['info']);
  const old = info as MatchData['info'] & { date?: string; heure?: string; dateTime?: string };
  let dateTime = old.dateTime ?? '';
  if (!dateTime && old.date && old.heure) {
    try {
      const [day, month, year] = old.date.split('/');
      const [h, m] = old.heure.replace('h', ':').split(':');
      if (year && month && day) {
        dateTime = new Date(+year, +month - 1, +day, +(h || 0), +(m || 0)).toISOString();
      }
    } catch {
      /* ignore */
    }
  }
  const scores = data.scores || ({} as MatchData['scores']);
  return {
    ...data,
    info: {
      championnat: info.championnat ?? '',
      dateTime,
      salle: info.salle ?? '',
      arbitreNom: info.arbitreNom ?? '',
      arbitreLicence: info.arbitreLicence ?? '',
      arbitreClub: info.arbitreClub ?? '',
      autoArbitrage: info.autoArbitrage ?? true,
    },
    scores: {
      set1: migrateSetScore(scores.set1),
      set2: migrateSetScore(scores.set2),
      set3: migrateSetScore(scores.set3),
      set4: migrateSetScore(scores.set4),
      set5: migrateSetScore(scores.set5),
    },
  };
}

export function useMatchSheets(storage: StorageAdapter = encryptedStorage) {
  const [sheets, setSheets] = useState<MatchSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const sheetsRef = useRef<MatchSheet[]>([]);
  sheetsRef.current = sheets;

  const loadSheets = useCallback(async () => {
    try {
      const raw = await storage.getItem(STORAGE_KEY);
      let parsed: unknown = [];
      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          log.warn('Corrupted match sheets data, resetting');
        }
      }
      const migrated = Array.isArray(parsed)
        ? parsed.map((s: MatchSheet) => ({ ...s, data: migrateMatchData(s.data as MatchData) }))
        : [];
      setSheets(migrated);
    } catch (e) {
      log.error('Failed to load match sheets', e);
      setSheets([]);
    } finally {
      setLoading(false);
    }
  }, [storage]);

  useEffect(() => {
    loadSheets();
  }, [loadSheets]);

  const saveSheet = useCallback(
    async (id: string | null, data: MatchData): Promise<MatchSheet> => {
      const now = new Date().toISOString();
      const prev = sheetsRef.current;
      const existing = id ? prev.find((s) => s.id === id) : null;
      const sheet: MatchSheet = existing
        ? { ...existing, data, updatedAt: now }
        : {
            id: id || `fm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            createdAt: now,
            updatedAt: now,
            data,
          };
      const next = existing ? prev.map((s) => (s.id === id ? sheet : s)) : [sheet, ...prev];
      setSheets(next);
      await storage.setItem(STORAGE_KEY, JSON.stringify(next));
      return sheet;
    },
    [storage]
  );

  const deleteSheet = useCallback(async (id: string) => {
    const prev = sheetsRef.current;
    const next = prev.filter((s) => s.id !== id);
    setSheets(next);
    await storage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [storage]);

  const getSheet = useCallback(
    (id: string) => sheets.find((s) => s.id === id) ?? null,
    [sheets]
  );

  return { sheets, loading, loadSheets, saveSheet, deleteSheet, getSheet };
}
