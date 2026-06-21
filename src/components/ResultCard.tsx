import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FinishedMatch } from '../data/types';
import TeamLogo from './TeamLogo';

type Props = { match: FinishedMatch };

export default function ResultCard({ match }: Props) {
  const diff = match.homeScore - match.awayScore;
  const homeWon = diff > 0;
  const awayWon = diff < 0;

  return (
    <View style={styles.card}>
      {/* الصف العلوي */}
      <View style={styles.topRow}>
        <Text style={styles.competition}>{match.competition}</Text>
        <Text style={styles.date}>{match.date}</Text>
      </View>

      {/* الفرق والنتيجة */}
      <View style={styles.matchRow}>
        <View style={styles.teamCol}>
          <TeamLogo logo={match.homeLogo} size={40} />
          <Text style={[styles.teamName, homeWon && styles.winner]} numberOfLines={2}>
            {match.homeTeam}
          </Text>
        </View>

        <View style={styles.scoreCol}>
          <Text style={[styles.homeScore, homeWon && styles.winScore]}>
            {match.homeScore}
          </Text>
          <Text style={styles.dash}>-</Text>
          <Text style={[styles.awayScore, awayWon && styles.winScore]}>
            {match.awayScore}
          </Text>
        </View>

        <View style={styles.teamCol}>
          <TeamLogo logo={match.awayLogo} size={40} />
          <Text style={[styles.teamName, awayWon && styles.winner]} numberOfLines={2}>
            {match.awayTeam}
          </Text>
        </View>
      </View>

      {/* وسوم اختيارية */}
      {Array.isArray(match.tags) && match.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {match.tags.map((tag: string, i: number) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* معلومة إضافية */}
      {!!match.extraInfo && (
        <Text style={styles.extraInfo}>{match.extraInfo}</Text>
      )}

      {/* شارة انتهت */}
      <View style={styles.finishedRow}>
        <View style={styles.finishedPill}>
          <Text style={styles.finishedText}>انتهت</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0A1520',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 14,
    borderWidth: 1,
    borderColor: '#152030',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  competition: { color: '#3A5868', fontSize: 11, fontWeight: '500' },
  date: { color: '#3A5868', fontSize: 11 },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
  },
  teamName: {
    color: '#7A9AAA',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  winner: {
    color: '#C8DCE5',
    fontWeight: '700',
  },
  scoreCol: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  homeScore: {
    color: '#8AA0AC',
    fontSize: 26,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  awayScore: {
    color: '#8AA0AC',
    fontSize: 26,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  winScore: {
    color: '#FFFFFF',
  },
  dash: {
    color: '#2A3F50',
    fontSize: 20,
    fontWeight: '300',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 10,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: '#0F1E2A',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { color: '#3A5868', fontSize: 10, fontWeight: '600' },
  extraInfo: {
    color: '#3A5868',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  finishedRow: {
    alignItems: 'center',
    marginTop: 10,
  },
  finishedPill: {
    backgroundColor: '#0F1E2A',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 10,
  },
  finishedText: { color: '#3A5868', fontSize: 10, fontWeight: '600' },
});
