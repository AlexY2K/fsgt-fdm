export interface Player {
  id: string;
  nom: string;
  prenom: string;
  numeroLicence: string;
}

export interface Team {
  id: 'A' | 'B';
  nom: string;
  joueurs: Player[];
  coach: string;
  capitaine: string;
}

export interface MatchInfo {
  championnat: string;
  dateTime: string;
  salle: string;
  arbitreNom: string;
  arbitreLicence: string;
  arbitreClub: string;
  autoArbitrage: boolean;
}

export interface SetScore {
  set1: { a: number | null; b: number | null };
  set2: { a: number | null; b: number | null };
  set3: { a: number | null; b: number | null };
  set4: { a: number | null; b: number | null };
  set5: { a: number | null; b: number | null };
}

export interface MatchResult {
  vainqueur: 'A' | 'B' | null;
  scoreSets: string;
}

export interface Signatures {
  capitaineA: string | null;
  capitaineB: string | null;
  arbitre: string | null;
}

export interface MatchData {
  info: MatchInfo;
  equipeA: Team;
  equipeB: Team;
  scores: SetScore;
  resultat: MatchResult;
  reclamations: string;
  signatures: Signatures;
}

export interface MatchSheet {
  id: string;
  createdAt: string;
  updatedAt: string;
  data: MatchData;
}
