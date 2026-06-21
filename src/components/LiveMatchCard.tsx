import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import { LiveMatch } from '../data/types';
import TeamLogo from './TeamLogo';

type Props = {
  match: LiveMatch;
  onPress: () => void;
};

export default function LiveMatchCard({ match, onPress }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const CardInner = () => (
    <View style={styles.inner}>
      {/* ── الصف العلوي: الدوري + شارة المباشر ── */}
      <View style={styles.topRow}>
        <Text style={styles.competition}>{match.competition}</Text>
        <View style={styles.livePill}>
          <Animated.View style={[styles.liveDot, { opacity: pulse }]} />
          <Text style={styles.liveLabel}>مباشر</Text>
        </View>
      </View>

      {/* ── badge اختياري (نهائي / ديربي / إلخ) ── */}
      {!!match.badge && (
        <View style={styles.badgeWrap}>
          <Text style={styles.badgeText}>⭐  {match.badge}</Text>
        </View>
      )}

      {/* ── القناة اختياري ── */}
      {!!match.channel && (
        <Text style={styles.channelText}>📺  {match.channel}</Text>
      )}

      {/* ── الفرق والنتيجة ── */}
      <View style={styles.matchRow}>
        {/* الفريق المضيف */}
        <View style={styles.teamCol}>
          <TeamLogo logo={match.homeLogo} size={52} />
          <Text style={styles.teamName} numberOfLines={2}>{match.homeTeam}</Text>
        </View>

        {/* النتيجة */}
        <View style={styles.scoreCol}>
          <Text style={styles.scoreText}>{match.homeScore}</Text>
          <View style={styles.scoreDivider}>
            <Text style={styles.minuteText}>{match.minute}'</Text>
          </View>
          <Text style={styles.scoreText}>{match.awayScore}</Text>
        </View>

        {/* الفريق الضيف */}
        <View style={styles.teamCol}>
          <TeamLogo logo={match.awayLogo} size={52} />
          <Text style={styles.teamName} numberOfLines={2}>{match.awayTeam}</Text>
        </View>
      </View>

      {/* ── الوسوم اختيارية ── */}
      {Array.isArray(match.tags) && match.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {match.tags.map((tag: string, i: number) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── معلومة إضافية اختيارية ── */}
      {!!match.extraInfo && (
        <Text style={styles.extraInfo}>{match.extraInfo}</Text>
      )}

      {/* ── زر المشاهدة ── */}
      <View style={styles.watchBtn}>
        <Text style={styles.watchText}>▶   شاهد البث المباشر</Text>
      </View>
    </View>
  );

  // إذا وُجدت صورة خلفية استخدمها
  if (match.thumbnail) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        <ImageBackground
          source={{ uri: match.thumbnail }}
          style={styles.thumbnail}
          imageStyle={styles.thumbnailImg}
        >
          <View style={styles.thumbnailOverlay}>
            <CardInner />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <CardInner />
    </TouchableOpacity>
  );
}

const CARD_BG = '#0D1B27';
const ACCENT = '#00E87A';
const RED = '#FF2D55';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1B2E3F',
    backgroundColor: CARD_BG,
    elevation: 6,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  inner: {
    padding: 16,
  },
  thumbnail: {
    width: '100%',
  },
  thumbnailImg: {
    borderRadius: 18,
    opacity: 0.25,
  },
  thumbnailOverlay: {
    backgroundColor: 'rgba(6,12,18,0.82)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  competition: {
    color: '#4E6A7E',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,45,85,0.12)',
    borderWidth: 1,
    borderColor: RED,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: RED,
  },
  liveLabel: {
    color: RED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeWrap: {
    alignSelf: 'center',
    backgroundColor: 'rgba(245,197,24,0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeText: {
    color: '#F5C518',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  channelText: {
    color: '#4E6A7E',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  teamName: {
    color: '#D8E8F0',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  scoreCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  scoreDivider: {
    alignItems: 'center',
    gap: 4,
  },
  minuteText: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: 'rgba(0,232,122,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: '#112030',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    color: '#4E8AA0',
    fontSize: 10,
    fontWeight: '600',
  },
  extraInfo: {
    color: '#4E6A7E',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
  },
  watchBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  watchText: {
    color: '#03180C',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
