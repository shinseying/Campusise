
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
          setLikesCount(payload.new.likes_count || 0);
          setDislikesCount(payload.new.dislikes_count || 0);
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
        (payload) => {
          if (user && payload.new?.user_id === user.id) {
            setUserReaction(payload.new?.reaction_type as 'like' | 'dislike' || null);
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

    const { error } = await supabase.rpc('handle_post_reaction', {
      p_post_id: postId,
      p_user_id: user.id,
      p_reaction_type: reactionType
    });

    if (error) {
      // RPC가 없다면 기본 방식 사용
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
    }
  };

  return {
    likesCount,
    dislikesCount,
    userReaction,
    toggleReaction,
  };
};
