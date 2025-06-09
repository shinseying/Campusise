
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealtime = () => {
  const { user } = useAuth();
  const presenceChannelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;

    // 사용자 온라인 상태 관리
    const presenceChannel = supabase.channel('online-users');
    presenceChannelRef.current = presenceChannel;

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        console.log('Online users:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    // 페이지 언로드 시 정리
    const handleBeforeUnload = () => {
      presenceChannel.untrack();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      presenceChannel.unsubscribe();
    };
  }, [user]);

  return {
    presenceChannel: presenceChannelRef.current,
  };
};
