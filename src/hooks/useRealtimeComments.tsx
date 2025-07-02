
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  is_anonymous: boolean;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
  };
}

export const useRealtimeComments = (postId: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      console.log('Fetching comments for post:', postId);
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:author_id (
            username,
            display_name
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        console.log('Comments fetched:', data);
        setComments(data as Comment[]);
      }
      setIsLoading(false);
    };

    const setupRealtimeSubscription = () => {
      // Clean up previous channel if it exists
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up previous comments channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }

      // Create new channel with unique name
      const channelName = `comments-${postId}-${Date.now()}`;
      console.log('Creating comments channel:', channelName);
      
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'comments',
            filter: `post_id=eq.${postId}`
          },
          async (payload) => {
            console.log('New comment:', payload);
            const newComment = payload.new as any;
            
            // Fetch the complete comment with profile data
            const { data } = await supabase
              .from('comments')
              .select(`
                *,
                profiles:author_id (
                  username,
                  display_name
                )
              `)
              .eq('id', newComment.id)
              .single();
              
            if (data) {
              setComments(prev => [...prev, data as Comment]);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'comments',
            filter: `post_id=eq.${postId}`
          },
          (payload) => {
            console.log('Comment deleted:', payload);
            const deletedComment = payload.old as any;
            setComments(prev => prev.filter(comment => comment.id !== deletedComment.id));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'comments',
            filter: `post_id=eq.${postId}`
          },
          async (payload) => {
            console.log('Comment updated:', payload);
            const updatedComment = payload.new as any;
            
            // Fetch the complete comment with profile data
            const { data } = await supabase
              .from('comments')
              .select(`
                *,
                profiles:author_id (
                  username,
                  display_name
                )
              `)
              .eq('id', updatedComment.id)
              .single();
              
            if (data) {
              setComments(prev => 
                prev.map(comment => 
                  comment.id === updatedComment.id ? data as Comment : comment
                )
              );
            }
          }
        )
        .subscribe((status) => {
          console.log('Comments channel status:', status);
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
          }
        });

      channelRef.current = channel;
    };

    // Fetch comments and setup subscription
    fetchComments().then(() => {
      setupRealtimeSubscription();
    });

    return () => {
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up comments channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [postId]);

  const addComment = async (content: string, isAnonymous: boolean = false) => {
    if (!user || !content.trim()) return;

    console.log('Adding comment:', content);

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          content: content.trim(),
          post_id: postId,
          author_id: user.id,
          is_anonymous: isAnonymous
        }])
        .select()
        .single();

      if (error) throw error;
      
      console.log('Comment added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  return {
    comments,
    commentsCount: comments.length,
    isLoading,
    addComment,
  };
};
