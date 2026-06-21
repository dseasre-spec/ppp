import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { VideoPlayer } from '../data/types';

export function useVideoPlayer(playerId: 1 | 2) {
  const [player, setPlayer] = useState<VideoPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('video_players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (err) {
      setError('تعذّر تحميل بيانات المشغّل');
    } else {
      setPlayer(data as VideoPlayer);
    }
    setLoading(false);
  }, [playerId]);

  useEffect(() => {
    fetch();

    // Realtime: تغيير الرابط من Dashboard يتحدّث فوراً عند المشاهد
    const channel = supabase
      .channel(`player-${playerId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'video_players',
          filter: `id=eq.${playerId}`,
        },
        (payload) => setPlayer(payload.new as VideoPlayer)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playerId, fetch]);

  return { player, loading, error };
}
