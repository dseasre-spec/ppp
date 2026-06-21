import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LiveMatch, FinishedMatch, MatchRow } from '../data/types';

type State = {
  liveMatches: LiveMatch[];
  finishedMatches: FinishedMatch[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useMatches(): State {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [finishedMatches, setFinishedMatches] = useState<FinishedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setError(null);
    const { data, error: err } = await supabase
      .from('matches')
      .select('id, type, data, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (err) {
      setError('تعذّر تحميل المباريات');
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as MatchRow[];

    // كل حقل في الـ JSON يصل كما هو — لا فلترة
    setLiveMatches(
      rows.filter((r) => r.type === 'live').map((r) => r.data as LiveMatch)
    );
    setFinishedMatches(
      rows.filter((r) => r.type === 'finished').map((r) => r.data as FinishedMatch)
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();

    // Realtime: أي تغيير يحدّث الواجهة فوراً
    const channel = supabase
      .channel('matches-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetch)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetch]);

  return { liveMatches, finishedMatches, loading, error, refresh: fetch };
}
