
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface RealtimeComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  author?: {
    username: string;
    display_name: string;
  };
}

export const useRealtimeComments = (postId: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<RealtimeComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentsCount, setCommentsCount] = useState(0);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!postId) return;

    // Clean up previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Fetch existing comments
    const fetchComments = async () => {
      console.log('Fetching comments for post:', postId);
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles!comments_author_id_fkey (
            username,
            display_name
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      } else {
        console.log('Comments fetched:', data?.length || 0);
        setComments(data || []);
        setCommentsCount(data?.length || 0);
      }
      setIsLoading(false);

      // Also get post's comment count
      const { data: post } = await supabase
        .from('posts')
        .select('comments_count')
        .eq('id', postId)
        .single();

      if (post) {
        console.log('Post comments count from DB:', post.comments_count);
        setCommentsCount(post.comments_count || 0);
      }
    };

    fetchComments();

    // Set up realtime subscription
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        async (payload) => {
          console.log('Comment changed:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Fetch the new comment with author info
            const { data: authorData } = await supabase
              .from('profiles')
              .select('username, display_name')
              .eq('id', (payload.new as any).author_id)
              .single();

            const newComment = {
              ...(payload.new as any),
              author: authorData
            } as RealtimeComment;

            setComments(prev => [...prev, newComment]);
            setCommentsCount(prev => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setComments(prev => prev.filter(comment => comment.id !== (payload.old as any).id));
            setCommentsCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `id=eq.${postId}`
        },
        (payload) => {
          console.log('Post comments count updated:', payload);
          const newData = payload.new as any;
          if (newData.comments_count !== undefined) {
            setCommentsCount(newData.comments_count);
          }
        }
      )
      .subscribe((status) => {
        console.log('Comments channel status:', status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [postId]);

  const addComment = async (content: string, isAnonymous: boolean = true) => {
    if (!user) return;

    console.log('Adding comment:', content, 'anonymous:', isAnonymous);

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content,
          is_anonymous: isAnonymous,
        });

      if (error) {
        console.error('Error adding comment:', error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return {
    comments,
    commentsCount,
    isLoading,
    addComment,
  };
};
