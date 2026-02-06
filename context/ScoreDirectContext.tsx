import React, { createContext, useCallback, useContext, useState } from 'react';
import type { Team, SetScore } from '@/types/match';

interface ScoreDirectState {
  equipeA: Team;
  equipeB: Team;
  scores: SetScore;
}

const initialState: ScoreDirectState = {
  equipeA: {
    id: 'A',
    nom: '',
    joueurs: [],
    coach: '',
    capitaine: '',
  },
  equipeB: {
    id: 'B',
    nom: '',
    joueurs: [],
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
};

type ScoreDirectContextValue = {
  match: ScoreDirectState;
  updateScores: (scores: Partial<SetScore>) => void;
};

const ScoreDirectContext = createContext<ScoreDirectContextValue | null>(null);

export function ScoreDirectProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ScoreDirectState>(initialState);

  const updateScores = useCallback((scores: Partial<SetScore>) => {
    setState((prev) => ({ ...prev, scores: { ...prev.scores, ...scores } }));
  }, []);

  const value: ScoreDirectContextValue = {
    match: state,
    updateScores,
  };

  return (
    <ScoreDirectContext.Provider value={value}>
      {children}
    </ScoreDirectContext.Provider>
  );
}

export function useScoreDirect(): ScoreDirectContextValue | null {
  return useContext(ScoreDirectContext);
}
