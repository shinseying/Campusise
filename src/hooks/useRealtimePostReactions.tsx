
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealtimePostReactions = (postId: string) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!postId) return;

    // Clean up previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Fetch initial reaction data
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

      // Check user's reaction
      if (user) {
        const { data: reaction } = await supabase
          .from('post_reactions')
          .select('reaction_type')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('User reaction:', reaction);
        setUserReaction(reaction ? reaction.reaction_type as 'like' | 'dislike' : null);
      }
    };

    fetchReactions();

    // Set up realtime subscription with simplified approach
    const channel = supabase
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
          console.log('Post updated:', payload);
          const newData = payload.new as any;
          setLikesCount(newData.likes_count || 0);
          setDislikesCount(newData.dislikes_count || 0);
        }
      )
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
          
          // Update user's reaction state if it's their reaction
          if (user && payload.new && (payload.new as any).user_id === user.id) {
            if (payload.eventType === 'DELETE') {
              setUserReaction(null);
            } else {
              setUserReaction((payload.new as any).reaction_type as 'like' | 'dislike');
            }
          }
          
          // Refetch post counts to ensure accuracy
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
      .subscribe((status) => {
        console.log('Reaction channel status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [postId, user]);

  const toggleReaction = async (reactionType: 'like' | 'dislike') => {
    if (!user) return;

    console.log('Toggling reaction:', reactionType, 'current:', userReaction);

    try {
      if (userReaction === reactionType) {
        // Remove reaction
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        if (error) throw error;
        setUserReaction(null);
      } else {
        // Add or update reaction
        const { error } = await supabase
          .from('post_reactions')
          .upsert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          });
        
        if (error) throw error;
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
