
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealtimePostReactions = (postId: string) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!postId || !user) return;

    const initializeReactions = async () => {
      console.log('Fetching reactions for post:', postId);
      
      // Fetch initial reaction data
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
      const { data: reaction } = await supabase
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('User reaction:', reaction);
      setUserReaction(reaction ? reaction.reaction_type as 'like' | 'dislike' : null);
    };

    const setupRealtimeSubscription = () => {
      // Clean up previous channel if it exists
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up previous channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }

      // Create new channel with unique name
      const channelName = `post-reactions-${postId}-${Date.now()}`;
      console.log('Creating channel:', channelName);
      
      const channel = supabase
        .channel(channelName)
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
            if (payload.new && (payload.new as any).user_id === user.id) {
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
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
          }
        });

      channelRef.current = channel;
    };

    // Initialize reactions and setup subscription
    initializeReactions().then(() => {
      setupRealtimeSubscription();
    });

    return () => {
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up reaction channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [postId, user?.id]);

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
        
        // Optimistically update local state
        setUserReaction(null);
        if (reactionType === 'like') {
          setLikesCount(prev => Math.max(0, prev - 1));
        } else {
          setDislikesCount(prev => Math.max(0, prev - 1));
        }
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
        
        // Optimistically update local state
        const oldReaction = userReaction;
        setUserReaction(reactionType);
        
        if (oldReaction === 'like' && reactionType === 'dislike') {
          setLikesCount(prev => Math.max(0, prev - 1));
          setDislikesCount(prev => prev + 1);
        } else if (oldReaction === 'dislike' && reactionType === 'like') {
          setDislikesCount(prev => Math.max(0, prev - 1));
          setLikesCount(prev => prev + 1);
        } else if (!oldReaction) {
          if (reactionType === 'like') {
            setLikesCount(prev => prev + 1);
          } else {
            setDislikesCount(prev => prev + 1);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      // Revert optimistic updates on error
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count, dislikes_count')
        .eq('id', postId)
        .single();
        
      if (post) {
        setLikesCount(post.likes_count || 0);
        setDislikesCount(post.dislikes_count || 0);
      }
      
      const { data: reaction } = await supabase
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      setUserReaction(reaction ? reaction.reaction_type as 'like' | 'dislike' : null);
    }
  };

  return {
    likesCount,
    dislikesCount,
    userReaction,
    toggleReaction,
  };
};
