import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useMatch } from '@/context/MatchContext';
import { useScoreDirect } from '@/context/ScoreDirectContext';
import { VOLLEY_RULES } from '@/constants/VolleyRules';

const SETS = ['set1', 'set2', 'set3', 'set4', 'set5'] as const;
const SET_LABELS = ['1er set', '2ème set', '3ème set', '4ème set', '5ème set'];

const TINT = '#1a5f7a';

type Source = 'match' | 'scoreDirect';

interface Props {
  source?: Source;
}

export function ScoreDirectView({ source = 'match' }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const matchContext = useMatch();
  const scoreDirectContext = useScoreDirect();

  const { match, updateScores } =
    source === 'match' ? matchContext : (scoreDirectContext ?? matchContext);
  const { equipeA, equipeB, scores } = match;

  const minGap = VOLLEY_RULES.MIN_POINT_GAP;

  const currentSetIndex = useMemo(() => {
    for (let i = 0; i < 5; i++) {
      const s = scores[SETS[i]];
      const a = s.a ?? 0;
      const b = s.b ?? 0;
      const pts = i === 4 ? VOLLEY_RULES.POINTS_TO_WIN_TIEBREAK : VOLLEY_RULES.POINTS_TO_WIN_SET;
      const hasWinner =
        (a >= pts && a - b >= minGap) || (b >= pts && b - a >= minGap);
      if (!hasWinner) return i + 1;
    }
    return 5;
  }, [scores, minGap]);

  const completedSets = useMemo(() => {
    const result: { label: string; a: number; b: number }[] = [];
    const minGap = VOLLEY_RULES.MIN_POINT_GAP;
    for (let i = 0; i < 5; i++) {
      const s = scores[SETS[i]];
      const a = s.a ?? 0;
      const b = s.b ?? 0;
      const pts = i === 4 ? VOLLEY_RULES.POINTS_TO_WIN_TIEBREAK : VOLLEY_RULES.POINTS_TO_WIN_SET;
      const hasWinner =
        (a >= pts && a - b >= minGap) || (b >= pts && b - a >= minGap);
      if (hasWinner) {
        result.push({ label: SET_LABELS[i], a, b });
      }
    }
    return result;
  }, [scores]);

  const currentKey = SETS[currentSetIndex - 1];
  const scoreA = scores[currentKey].a ?? 0;
  const scoreB = scores[currentKey].b ?? 0;

  const isTieBreak = currentSetIndex === 5;
  const pointsToWin = isTieBreak ? VOLLEY_RULES.POINTS_TO_WIN_TIEBREAK : VOLLEY_RULES.POINTS_TO_WIN_SET;

  const isSetWon = useMemo(() => {
    return (
      (scoreA >= pointsToWin && scoreA - scoreB >= minGap) ||
      (scoreB >= pointsToWin && scoreB - scoreA >= minGap)
    );
  }, [scoreA, scoreB, pointsToWin, minGap]);

  const setWins = useMemo(() => {
    let winsA = 0;
    let winsB = 0;
    for (let i = 0; i < 5; i++) {
      const s = scores[SETS[i]];
      const a = s.a ?? 0;
      const b = s.b ?? 0;
      const pts = i === 4 ? VOLLEY_RULES.POINTS_TO_WIN_TIEBREAK : VOLLEY_RULES.POINTS_TO_WIN_SET;
      if (a >= pts && a - b >= minGap) winsA++;
      else if (b >= pts && b - a >= minGap) winsB++;
    }
    return { winsA, winsB };
  }, [scores, minGap]);

  const matchOver =
    setWins.winsA >= VOLLEY_RULES.SETS_TO_WIN_MATCH ||
    setWins.winsB >= VOLLEY_RULES.SETS_TO_WIN_MATCH;

  const canPlayCurrentSet = !matchOver && currentSetIndex <= 5;

  const inc = (side: 'a' | 'b') => {
    if (isSetWon || !canPlayCurrentSet) return;
    const s = scores[currentKey];
    const v = side === 'a' ? scoreA : scoreB;
    updateScores({
      [currentKey]: { ...s, [side]: v + 1 },
    });
  };

  const dec = (side: 'a' | 'b') => {
    if (!canPlayCurrentSet) return;
    const s = scores[currentKey];
    const v = side === 'a' ? scoreA : scoreB;
    if (v > 0) {
      updateScores({
        [currentKey]: { ...s, [side]: v - 1 },
      });
    }
  };

  useEffect(() => {
    let changed = false;
    const updates: Partial<typeof scores> = {};
    for (let i = 0; i < 5; i++) {
      const key = SETS[i];
      const s = scores[key];
      const a = s.a ?? 0;
      const b = s.b ?? 0;
      const pts = i === 4 ? VOLLEY_RULES.POINTS_TO_WIN_TIEBREAK : VOLLEY_RULES.POINTS_TO_WIN_SET;
      const hasWinner =
        (a >= pts && a - b >= minGap) || (b >= pts && b - a >= minGap);
      if (hasWinner && (s.a === null || s.b === null)) {
        updates[key] = { a, b };
        changed = true;
      }
    }
    if (changed) {
      updateScores(updates);
    }
  }, [scores, minGap, updateScores]);

  const nomA = equipeA.nom || 'Équipe A';
  const nomB = equipeB.nom || 'Équipe B';

  const setInfo =
    canPlayCurrentSet
      ? `Set ${currentSetIndex} / 5 — ${pointsToWin} pts, ${minGap} d'écart`
      : matchOver
        ? `Match terminé — ${nomA} ${setWins.winsA} - ${setWins.winsB} ${nomB}`
        : '';

  const completedSetsText =
    completedSets.length > 0
      ? completedSets.map((s) => `${s.a}-${s.b}`).join(', ')
      : '';

  const ls = isLandscape;

  return (
    <View
      style={[
        styles.container,
        ls && styles.containerLandscape,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={[styles.teamsSection, ls && styles.teamsSectionLandscape]}>
        <Text
          style={[styles.teamName, ls && styles.teamNameLandscape, { color: colors.text }]}
          numberOfLines={1}
        >
          {nomA}
        </Text>
        <Text style={[styles.vs, ls && styles.vsLandscape, { color: colors.tabIconDefault }]}>
          vs
        </Text>
        <Text
          style={[styles.teamName, ls && styles.teamNameLandscape, { color: colors.text }]}
          numberOfLines={1}
        >
          {nomB}
        </Text>
      </View>
      {completedSetsText ? (
        <Text
          style={[styles.recapPlain, ls && styles.recapPlainLandscape, { color: colors.tabIconDefault }]}
        >
          {completedSetsText}
        </Text>
      ) : null}
      {setInfo ? (
        <Text
          style={[styles.setInfo, ls && styles.setInfoLandscape, { color: colors.tabIconDefault }]}
        >
          {setInfo}
        </Text>
      ) : null}

      {!ls && canPlayCurrentSet && (
        <View style={styles.scoreSection}>
            <View style={styles.scoreColumn}>
            <TouchableOpacity
              style={[styles.incBtn, { backgroundColor: isSetWon ? colors.border : TINT }]}
              onPress={() => inc('a')}
              disabled={isSetWon}
            >
              <Text
                style={[styles.incBtnText, { color: isSetWon ? colors.tabIconDefault : '#fff' }]}
              >
                +1
              </Text>
            </TouchableOpacity>
            <Text style={[styles.scoreDisplay, { color: colors.text }]}>{scoreA}</Text>
            <TouchableOpacity
              style={[styles.decBtn, { backgroundColor: colors.border }]}
              onPress={() => dec('a')}
              disabled={isSetWon}
            >
              <FontAwesome name="minus" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.scoreSep, { color: colors.tabIconDefault }]}>-</Text>
          <View style={styles.scoreColumn}>
            <TouchableOpacity
              style={[styles.incBtn, { backgroundColor: isSetWon ? colors.border : TINT }]}
              onPress={() => inc('b')}
              disabled={isSetWon}
            >
              <Text
                style={[styles.incBtnText, { color: isSetWon ? colors.tabIconDefault : '#fff' }]}
              >
                +1
              </Text>
            </TouchableOpacity>
            <Text style={[styles.scoreDisplay, { color: colors.text }]}>{scoreB}</Text>
            <TouchableOpacity
              style={[styles.decBtn, { backgroundColor: colors.border }]}
              onPress={() => dec('b')}
              disabled={isSetWon}
            >
              <FontAwesome name="minus" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {matchOver && (
        <View
          style={[
            styles.matchOverCard,
            ls && styles.matchOverCardLandscape,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text
            style={[styles.matchOverTitle, ls && styles.matchOverTitleLandscape, { color: colors.tint }]}
          >
            Match terminé
          </Text>
          <Text
            style={[
              styles.matchOverScore,
              ls && styles.matchOverScoreLandscape,
              { color: colors.text },
            ]}
          >
            {nomA} {setWins.winsA} - {setWins.winsB} {nomB}
          </Text>
        </View>
      )}

      {ls && canPlayCurrentSet ? (
            <View style={[styles.scoreSection, styles.scoreSectionLandscape]}>
              <View style={[styles.scoreColumn, styles.scoreColumnLandscape]}>
                <TouchableOpacity
                  style={[
                    styles.incBtn,
                    styles.incBtnLandscape,
                    { backgroundColor: isSetWon ? colors.border : TINT },
                  ]}
                  onPress={() => inc('a')}
                  disabled={isSetWon}
                >
                  <Text
                    style={[
                      styles.incBtnText,
                      styles.incBtnTextLandscape,
                      { color: isSetWon ? colors.tabIconDefault : '#fff' },
                    ]}
                  >
                    +1
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[styles.scoreDisplay, styles.scoreDisplayLandscape, { color: colors.text }]}
                >
                  {scoreA}
                </Text>
                <TouchableOpacity
                  style={[styles.decBtn, styles.decBtnLandscape, { backgroundColor: colors.border }]}
                  onPress={() => dec('a')}
                  disabled={isSetWon}
                >
                  <FontAwesome name="minus" size={18} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.scoreSep, styles.scoreSepLandscape, { color: colors.tabIconDefault }]}>
                -
              </Text>
              <View style={[styles.scoreColumn, styles.scoreColumnLandscape]}>
                <TouchableOpacity
                  style={[
                    styles.incBtn,
                    styles.incBtnLandscape,
                    { backgroundColor: isSetWon ? colors.border : TINT },
                  ]}
                  onPress={() => inc('b')}
                  disabled={isSetWon}
                >
                  <Text
                    style={[
                      styles.incBtnText,
                      styles.incBtnTextLandscape,
                      { color: isSetWon ? colors.tabIconDefault : '#fff' },
                    ]}
                  >
                    +1
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[styles.scoreDisplay, styles.scoreDisplayLandscape, { color: colors.text }]}
                >
                  {scoreB}
                </Text>
                <TouchableOpacity
                  style={[styles.decBtn, styles.decBtnLandscape, { backgroundColor: colors.border }]}
                  onPress={() => dec('b')}
                  disabled={isSetWon}
                >
                  <FontAwesome name="minus" size={18} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
      ) : (
        <View style={styles.recapSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  containerLandscape: {
    padding: 24,
  },
  teamsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  teamsSectionLandscape: { marginBottom: 12 },
  teamName: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  teamNameLandscape: { fontSize: 22 },
  vs: { fontSize: 16 },
  vsLandscape: { fontSize: 18 },
  recapPlain: { fontSize: 14, textAlign: 'center', marginBottom: 4 },
  recapPlainLandscape: { fontSize: 16, marginBottom: 6 },
  setInfo: { fontSize: 13, textAlign: 'center', marginBottom: 24 },
  setInfoLandscape: { fontSize: 16, marginBottom: 16 },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 28,
  },
  scoreSectionLandscape: { marginBottom: 0, flex: 1 },
  scoreColumn: {
    alignItems: 'center',
    gap: 16,
  },
  scoreColumnLandscape: { gap: 12 },
  incBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incBtnLandscape: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  incBtnText: { fontSize: 18, fontWeight: '700' },
  incBtnTextLandscape: { fontSize: 16 },
  scoreDisplay: { fontSize: 36, fontWeight: '700' },
  scoreDisplayLandscape: { fontSize: 48 },
  decBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decBtnLandscape: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  scoreSep: { fontSize: 28, fontWeight: '600' },
  scoreSepLandscape: { fontSize: 36 },
  recapSpacer: { flex: 1, minHeight: 24 },
  matchOverCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 16,
  },
  matchOverCardLandscape: {
    padding: 16,
    marginTop: 12,
    width: '100%',
  },
  matchOverTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  matchOverTitleLandscape: { fontSize: 22, marginBottom: 8 },
  matchOverScore: { fontSize: 18, fontWeight: '600' },
  matchOverScoreLandscape: { fontSize: 20 },
});
