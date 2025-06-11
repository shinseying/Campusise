
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealtimePostReactions = (postId: string) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    if (!postId) return;

    // 기존 반응 데이터 불러오기
    const fetchReactions = async () => {
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count, dislikes_count')
        .eq('id', postId)
        .single();

      if (post) {
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

        if (reaction) {
          setUserReaction(reaction.reaction_type as 'like' | 'dislike');
        } else {
          setUserReaction(null); // 명시적으로 null로 설정
        }
      }
    };

    fetchReactions();

    // 실시간 게시글 업데이트 구독
    const postsChannel = supabase
      .channel(`post-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `id=eq.${postId}`
        },
        (payload) => {
          const newData = payload.new as any;
          setLikesCount(newData.likes_count || 0);
          setDislikesCount(newData.dislikes_count || 0);
        }
      )
      .subscribe();

    // 실시간 반응 구독
    const reactionsChannel = supabase
      .channel(`reactions-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_reactions',
          filter: `post_id=eq.${postId}`
        },
        async (payload) => {
          // 사용자 자신의 반응 변경 감지
          if (user && payload.eventType) {
            if (payload.eventType === 'DELETE' && 
                (payload.old as any).user_id === user.id) {
              // 사용자가 반응을 삭제한 경우
              setUserReaction(null);
            } else if ((payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') && 
                      (payload.new as any).user_id === user.id) {
              // 사용자가 반응을 추가하거나 변경한 경우
              setUserReaction((payload.new as any).reaction_type as 'like' | 'dislike');
            }
          }
          
          // 좋아요/싫어요 카운트를 다시 가져와 최신 상태 유지
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

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(reactionsChannel);
    };
  }, [postId, user]);

  const toggleReaction = async (reactionType: 'like' | 'dislike') => {
    if (!user) return;

    // 직접 데이터베이스 조작 방식 사용
    try {
      if (userReaction === reactionType) {
        // 같은 반응이면 제거
        await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
          
        // 즉시 UI 업데이트
        setUserReaction(null);
      } else {
        // 다른 반응이거나 처음이면 upsert
        await supabase
          .from('post_reactions')
          .upsert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          });
          
        // 즉시 UI 업데이트
        setUserReaction(reactionType);
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
