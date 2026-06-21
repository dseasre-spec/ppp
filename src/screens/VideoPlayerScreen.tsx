import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer } from '../hooks/useVideoPlayer';

const ACCENT = '#00E87A';

// HTML مشغّل HLS/M3U8/MP4 داخل WebView
function buildHTML(url: string, title: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:100%;height:100%;background:#000;overflow:hidden;}
    video{width:100%;height:100%;object-fit:contain;display:block;}
    #err{display:none;position:absolute;inset:0;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:#8AA0AC;font-family:system-ui;font-size:14px;text-align:center;padding:20px;}
    #err.show{display:flex;}
    #err span{font-size:40px;}
  </style>
</head>
<body>
  <video id="v" controls autoplay playsinline></video>
  <div id="err"><span>📡</span>تعذّر تشغيل البث<br/><small style="color:#3A5868">${url}</small></div>
  <script>
    var v = document.getElementById('v');
    var err = document.getElementById('err');
    var src = ${JSON.stringify(url)};

    function showErr(){ err.className='show'; v.style.display='none'; }

    if(Hls.isSupported()){
      var hls = new Hls({ enableWorker:false });
      hls.loadSource(src);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, function(){ v.play().catch(function(){}); });
      hls.on(Hls.Events.ERROR, function(e,d){ if(d.fatal) showErr(); });
    } else if(v.canPlayType('application/vnd.apple.mpegurl')){
      v.src = src;
      v.addEventListener('error', showErr);
      v.play().catch(function(){});
    } else {
      v.src = src;
      v.addEventListener('error', showErr);
      v.play().catch(function(){});
    }
  </script>
</body>
</html>`;
}

export default function VideoPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = (Number(id) === 2 ? 2 : 1) as 1 | 2;
  const router = useRouter();
  const { player, loading, error } = useVideoPlayer(playerId);

  // وضع أفقي عند فتح الشاشة
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const goBack = useCallback(() => router.back(), [router]);

  return (
    <View style={styles.root}>
      {/* ── زر الإغلاق ── */}
      <TouchableOpacity style={styles.closeBtn} onPress={goBack} hitSlop={12}>
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>

      {/* ── اسم المشغّل ── */}
      {!loading && player && (
        <View style={styles.titlePill}>
          <Text style={styles.titleText}>{player.player_name}</Text>
        </View>
      )}

      {/* ── تحميل ── */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color={ACCENT} size="large" />
          <Text style={styles.stateText}>جاري تحميل البث...</Text>
        </View>
      )}

      {/* ── خطأ اتصال ── */}
      {!loading && !!error && (
        <View style={styles.center}>
          <Text style={styles.stateIcon}>📡</Text>
          <Text style={styles.stateTitle}>{error}</Text>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backBtnText}>الرجوع</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── مشغّل متوقف ── */}
      {!loading && !error && player && !player.is_active && (
        <View style={styles.center}>
          <Text style={styles.stateIcon}>⏸️</Text>
          <Text style={styles.stateTitle}>البث متوقف مؤقتاً</Text>
          <Text style={styles.stateText}>يرجى المحاولة لاحقاً</Text>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backBtnText}>الرجوع</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── لا يوجد رابط بعد ── */}
      {!loading && !error && player && player.is_active && !player.stream_url && (
        <View style={styles.center}>
          <Text style={styles.stateIcon}>🔧</Text>
          <Text style={styles.stateTitle}>رابط البث غير مضاف بعد</Text>
          <Text style={styles.stateText}>أضف stream_url من لوحة Supabase</Text>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backBtnText}>الرجوع</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── مشغّل الفيديو ── */}
      {!loading && !error && player && player.is_active && !!player.stream_url && (
        <WebView
          style={styles.player}
          source={{ html: buildHTML(player.stream_url, player.player_name) }}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['*']}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  player: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 100,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  titlePill: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  titleText: {
    color: '#5A7A8A',
    fontSize: 11,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 30,
  },
  stateIcon: { fontSize: 52 },
  stateTitle: {
    color: '#D0E0E8',
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
  backBtn: {
    marginTop: 8,
    backgroundColor: '#0D1E2E',
    paddingHorizontal: 26,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1B3040',
  },
  backBtnText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '700',
  },
});
