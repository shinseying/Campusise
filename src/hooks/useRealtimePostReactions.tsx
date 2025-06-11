
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealtimePostReactions = (postId: string) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!postId) return;

    // 기존 채널들 정리
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

    // 기존 반응 데이터 불러오기
    const fetchReactions = async () => {
      console.log('Fetching reactions for post:', postId);
      
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count, dislikes_count')
        .eq('id', postId)
        .single();

      if (post) {
        console.log('Post reaction counts:', post);
        setLikesCount(post.likes_count || 0);
        setDislikesCount(post.dislikes_count || 0);
      }

      // 사용자의 반응 확인
      if (user) {
        const { data: reaction } = await supabase
          .from('post_reactions')
          .select('reaction_type')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single();

        console.log('User reaction:', reaction);
        setUserReaction(reaction ? reaction.reaction_type as 'like' | 'dislike' : null);
      }
    };

    fetchReactions();

    // 실시간 게시글 업데이트 구독
    const postsChannel = supabase
      .channel(`post-reactions-${postId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `id=eq.${postId}`
        },
        (payload) => {
          console.log('Post updated:', payload);
          const newData = payload.new as any;
          setLikesCount(newData.likes_count || 0);
          setDislikesCount(newData.dislikes_count || 0);
        }
      )
      .subscribe();

    channelsRef.current.push(postsChannel);

    // 실시간 반응 구독
    const reactionsChannel = supabase
      .channel(`reactions-${postId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_reactions',
          filter: `post_id=eq.${postId}`
        },
        async (payload) => {
          console.log('Reaction changed:', payload);
          
          // 사용자 자신의 반응 변경 감지
          if (user && payload.eventType) {
            if (payload.eventType === 'DELETE' && 
                (payload.old as any).user_id === user.id) {
              setUserReaction(null);
            } else if ((payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') && 
                      (payload.new as any).user_id === user.id) {
              setUserReaction((payload.new as any).reaction_type as 'like' | 'dislike');
            }
          }
          
          // 카운트 업데이트
          const { data: post } = await supabase
            .from('posts')
            .select('likes_count, dislikes_count')
            .eq('id', postId)
            .single();
            
          if (post) {
            setLikesCount(post.likes_count || 0);
            setDislikesCount(post.dislikes_count || 0);
          }
        }
      )
      .subscribe();

    channelsRef.current.push(reactionsChannel);

    return () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [postId, user]);

  const toggleReaction = async (reactionType: 'like' | 'dislike') => {
    if (!user) return;

    console.log('Toggling reaction:', reactionType, 'current:', userReaction);

    try {
      if (userReaction === reactionType) {
        // 같은 반응이면 제거
        await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // 다른 반응이거나 처음이면 upsert
        await supabase
          .from('post_reactions')
          .upsert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          });
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  return {
    likesCount,
    dislikesCount,
    userReaction,
    toggleReaction,
  };
};
