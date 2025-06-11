
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealtime = () => {
  const { user } = useAuth();
  const presenceChannelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!user || isSubscribedRef.current) return;

    // 기존 채널 정리
    if (presenceChannelRef.current) {
      try {
        presenceChannelRef.current.unsubscribe();
        supabase.removeChannel(presenceChannelRef.current);
      } catch (error) {
        console.log('Error cleaning up presence channel:', error);
      }
      presenceChannelRef.current = null;
      isSubscribedRef.current = false;
    }

    // 고유한 채널 이름 생성
    const channelName = `online-users-${user.id}-${Date.now()}-${Math.random()}`;
    const presenceChannel = supabase.channel(channelName);
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
        console.log('Presence subscription status:', status);
        if (status === 'SUBSCRIBED' && !isSubscribedRef.current) {
          isSubscribedRef.current = true;
          try {
            await presenceChannel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Error tracking presence:', error);
          }
        }
      });

    // 페이지 언로드 시 정리
    const handleBeforeUnload = () => {
      if (presenceChannelRef.current) {
        try {
          presenceChannelRef.current.untrack();
        } catch (error) {
          console.log('Error untracking on beforeunload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (presenceChannelRef.current) {
        try {
          presenceChannelRef.current.unsubscribe();
          supabase.removeChannel(presenceChannelRef.current);
        } catch (error) {
          console.log('Error cleaning up presence channel on unmount:', error);
        }
      }
      isSubscribedRef.current = false;
    };
  }, [user]);

  return {
    presenceChannel: presenceChannelRef.current,
  };
};
