import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMatches } from '../hooks/useMatches';
import LiveMatchCard from '../components/LiveMatchCard';
import ResultCard from '../components/ResultCard';

type Tab = 'live' | 'results';

const BG = '#060C12';
const ACCENT = '#00E87A';
const RED = '#FF2D55';

export default function HomeScreen() {
  const [tab, setTab] = useState<Tab>('live');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { liveMatches, finishedMatches, loading, error, refresh } = useMatches();

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* ─── Header ─── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>⚽</Text>
          <View>
            <Text style={styles.headerTitle}>بث مباشر</Text>
            <Text style={styles.headerSub}>كرة القدم</Text>
          </View>
        </View>
        {/* عدد المباريات المباشرة */}
        {liveMatches.length > 0 && (
          <View style={styles.liveCountBadge}>
            <View style={styles.liveCountDot} />
            <Text style={styles.liveCountText}>{liveMatches.length} مباشر</Text>
          </View>
        )}
      </View>

      {/* ─── Tab Bar ─── */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === 'live' && styles.tabActive]}
          onPress={() => setTab('live')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === 'live' && styles.tabTextActive]}>
            مباريات مباشرة
          </Text>
          {liveMatches.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{liveMatches.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === 'results' && styles.tabActive]}
          onPress={() => setTab('results')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === 'results' && styles.tabTextActive]}>
            النتائج
          </Text>
        </TouchableOpacity>
      </View>

      {/* ─── Content ─── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT}
            colors={[ACCENT]}
          />
        }
      >
        {/* Loading */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator color={ACCENT} size="large" />
            <Text style={styles.stateText}>جاري التحميل...</Text>
          </View>
        )}

        {/* Error */}
        {!loading && !!error && (
          <View style={styles.center}>
            <Text style={styles.stateIcon}>📡</Text>
            <Text style={styles.stateTitle}>تعذّر الاتصال</Text>
            <Text style={styles.stateText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Live Matches */}
        {!loading && !error && tab === 'live' && (
          <>
            {liveMatches.length === 0 ? (
              <View style={styles.center}>
                <Text style={styles.stateIcon}>📡</Text>
                <Text style={styles.stateTitle}>لا توجد مباريات مباشرة الآن</Text>
                <Text style={styles.stateText}>اسحب للأسفل للتحديث أو شاهد النتائج</Text>
              </View>
            ) : (
              liveMatches.map((match) => (
                <LiveMatchCard
                  key={match.id}
                  match={match}
                  onPress={() => router.push(`/player/${match.playerId}`)}
                />
              ))
            )}
          </>
        )}

        {/* Results */}
        {!loading && !error && tab === 'results' && (
          <>
            {finishedMatches.length === 0 ? (
              <View style={styles.center}>
                <Text style={styles.stateIcon}>🏁</Text>
                <Text style={styles.stateTitle}>لا توجد نتائج بعد</Text>
              </View>
            ) : (
              finishedMatches.map((match) => (
                <ResultCard key={match.id} match={match} />
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#0D1B27',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: { fontSize: 26 },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: '#3A5868',
    fontSize: 11,
    marginTop: 1,
  },
  liveCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,45,85,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,85,0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  liveCountDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: RED,
  },
  liveCountText: {
    color: RED,
    fontSize: 12,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    backgroundColor: '#0A1520',
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 11,
    gap: 7,
  },
  tabActive: {
    backgroundColor: '#0D1E2E',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  tabText: {
    color: '#3A5868',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#D0E8F0',
  },
  tabBadge: {
    backgroundColor: RED,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 6, paddingBottom: 40 },
  center: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 30,
  },
  stateIcon: { fontSize: 52 },
  stateTitle: {
    color: '#8AA0AC',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  stateText: {
    color: '#3A5868',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: '#0D1E2E',
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1B3040',
  },
  retryText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '700',
  },
});
