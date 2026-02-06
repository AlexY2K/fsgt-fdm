import React, { createContext, useCallback, useContext, useState } from 'react';
import { isValidSignature } from '@/constants/Validation';
import type { MatchData, Player, SetScore, Signatures } from '@/types/match';

interface MatchState {
  info: MatchData['info'];
  equipeA: MatchData['equipeA'];
  equipeB: MatchData['equipeB'];
  scores: SetScore;
  resultat: MatchData['resultat'];
  reclamations: string;
  signatures: Signatures;
}

const initialMatch: MatchState = {
  info: {
    championnat: '',
    dateTime: '',
    salle: '',
    arbitreNom: '',
    arbitreLicence: '',
    arbitreClub: '',
    autoArbitrage: true,
  },
  equipeA: {
    id: 'A',
    nom: '',
    joueurs: [
      { id: 'p_a_1', nom: '', prenom: '', numeroLicence: '' },
      { id: 'p_a_2', nom: '', prenom: '', numeroLicence: '' },
      { id: 'p_a_3', nom: '', prenom: '', numeroLicence: '' },
      { id: 'p_a_4', nom: '', prenom: '', numeroLicence: '' },
    ],
    coach: '',
    capitaine: '',
  },
  equipeB: {
    id: 'B',
    nom: '',
    joueurs: [
      { id: 'p_b_1', nom: '', prenom: '', numeroLicence: '' },
      { id: 'p_b_2', nom: '', prenom: '', numeroLicence: '' },
      { id: 'p_b_3', nom: '', prenom: '', numeroLicence: '' },
      { id: 'p_b_4', nom: '', prenom: '', numeroLicence: '' },
    ],
    coach: '',
    capitaine: '',
  },
  scores: {
    set1: { a: null, b: null },
    set2: { a: null, b: null },
    set3: { a: null, b: null },
    set4: { a: null, b: null },
    set5: { a: null, b: null },
  },
  resultat: { vainqueur: null, scoreSets: '' },
  reclamations: '',
  signatures: { capitaineA: null, capitaineB: null, arbitre: null },
};

type MatchContextValue = {
  match: MatchState;
  currentSheetId: string | null;
  updateInfo: (info: Partial<MatchState['info']>) => void;
  updateEquipeA: (data: Partial<MatchState['equipeA']>) => void;
  updateEquipeB: (data: Partial<MatchState['equipeB']>) => void;
  updateJoueurA: (index: number, data: Partial<Player>) => void;
  updateJoueurB: (index: number, data: Partial<Player>) => void;
  addJoueurA: () => void;
  addJoueurB: () => void;
  removeJoueurA: (index: number) => void;
  removeJoueurB: (index: number) => void;
  updateScores: (scores: Partial<SetScore>) => void;
  updateResultat: (r: Partial<MatchState['resultat']>) => void;
  updateReclamations: (s: string) => void;
  updateSignatures: (s: Partial<Signatures>) => void;
  setMatchFromData: (data: MatchData, sheetId?: string | null) => void;
  setCurrentSheetId: (id: string | null) => void;
  getMatch: () => MatchData;
  resetMatch: () => void;
};

const MatchContext = createContext<MatchContextValue | null>(null);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [match, setMatch] = useState<MatchState>(initialMatch);
  const [currentSheetId, setCurrentSheetId] = useState<string | null>(null);

  const updateInfo = useCallback((info: Partial<MatchState['info']>) => {
    setMatch((prev) => ({ ...prev, info: { ...prev.info, ...info } }));
  }, []);

  const updateEquipeA = useCallback((data: Partial<MatchState['equipeA']>) => {
    setMatch((prev) => ({ ...prev, equipeA: { ...prev.equipeA, ...data } }));
  }, []);

  const updateEquipeB = useCallback((data: Partial<MatchState['equipeB']>) => {
    setMatch((prev) => ({ ...prev, equipeB: { ...prev.equipeB, ...data } }));
  }, []);

  const updateJoueurA = useCallback((index: number, data: Partial<Player>) => {
    setMatch((prev) => {
      const joueurs = [...prev.equipeA.joueurs];
      if (joueurs[index]) joueurs[index] = { ...joueurs[index], ...data };
      return { ...prev, equipeA: { ...prev.equipeA, joueurs } };
    });
  }, []);

  const updateJoueurB = useCallback((index: number, data: Partial<Player>) => {
    setMatch((prev) => {
      const joueurs = [...prev.equipeB.joueurs];
      if (joueurs[index]) joueurs[index] = { ...joueurs[index], ...data };
      return { ...prev, equipeB: { ...prev.equipeB, joueurs } };
    });
  }, []);

  const addJoueurA = useCallback(() => {
    setMatch((prev) => ({
      ...prev,
      equipeA: {
        ...prev.equipeA,
        joueurs: [
          ...prev.equipeA.joueurs,
          { id: `p_${Date.now()}`, nom: '', prenom: '', numeroLicence: '' },
        ],
      },
    }));
  }, []);

  const addJoueurB = useCallback(() => {
    setMatch((prev) => ({
      ...prev,
      equipeB: {
        ...prev.equipeB,
        joueurs: [
          ...prev.equipeB.joueurs,
          { id: `p_${Date.now()}`, nom: '', prenom: '', numeroLicence: '' },
        ],
      },
    }));
  }, []);

  const removeJoueurA = useCallback((index: number) => {
    setMatch((prev) => ({
      ...prev,
      equipeA: {
        ...prev.equipeA,
        joueurs: prev.equipeA.joueurs.filter((_, i) => i !== index),
      },
    }));
  }, []);

  const removeJoueurB = useCallback((index: number) => {
    setMatch((prev) => ({
      ...prev,
      equipeB: {
        ...prev.equipeB,
        joueurs: prev.equipeB.joueurs.filter((_, i) => i !== index),
      },
    }));
  }, []);

  const updateScores = useCallback((scores: Partial<SetScore>) => {
    setMatch((prev) => ({ ...prev, scores: { ...prev.scores, ...scores } }));
  }, []);

  const updateResultat = useCallback((r: Partial<MatchState['resultat']>) => {
    setMatch((prev) => ({ ...prev, resultat: { ...prev.resultat, ...r } }));
  }, []);

  const updateReclamations = useCallback((s: string) => {
    setMatch((prev) => ({ ...prev, reclamations: s }));
  }, []);

  const updateSignatures = useCallback((s: Partial<Signatures>) => {
    setMatch((prev) => ({
      ...prev,
      signatures: { ...prev.signatures, ...s },
    }));
  }, []);

  const setMatchFromData = useCallback((data: MatchData, sheetId?: string | null) => {
    const s = data.signatures;
    const signatures: Signatures = {
      capitaineA: s?.capitaineA && isValidSignature(s.capitaineA) ? s.capitaineA : null,
      capitaineB: s?.capitaineB && isValidSignature(s.capitaineB) ? s.capitaineB : null,
      arbitre: s?.arbitre && isValidSignature(s.arbitre) ? s.arbitre : null,
    };
    setMatch({
      info: data.info,
      equipeA: data.equipeA,
      equipeB: data.equipeB,
      scores: data.scores,
      resultat: data.resultat,
      reclamations: data.reclamations,
      signatures,
    });
    setCurrentSheetId(sheetId ?? null);
  }, []);

  const setCurrentSheetIdCb = useCallback((id: string | null) => {
    setCurrentSheetId(id);
  }, []);

  const getMatch = useCallback(
    (): MatchData => ({
      ...match,
    }),
    [match]
  );

  const resetMatch = useCallback(() => {
    setMatch(initialMatch);
    setCurrentSheetId(null);
  }, []);

  const value: MatchContextValue = {
    match,
    currentSheetId,
    updateInfo,
    updateEquipeA,
    updateEquipeB,
    updateJoueurA,
    updateJoueurB,
    addJoueurA,
    addJoueurB,
    removeJoueurA,
    removeJoueurB,
    updateScores,
    updateResultat,
    updateReclamations,
    updateSignatures,
    setMatchFromData,
    setCurrentSheetId: setCurrentSheetIdCb,
    getMatch,
    resetMatch,
  };

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error('useMatch must be used within MatchProvider');
  return ctx;
}

/** Hook ciblé : infos du match uniquement (Interface Segregation) */
export function useMatchInfo() {
  const ctx = useMatch();
  return {
    info: ctx.match.info,
    updateInfo: ctx.updateInfo,
  };
}

/** Hook ciblé : scores uniquement (Interface Segregation) */
export function useMatchScores() {
  const ctx = useMatch();
  return {
    scores: ctx.match.scores,
    updateScores: ctx.updateScores,
  };
}
