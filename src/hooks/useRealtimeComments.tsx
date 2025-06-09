
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!postId) return;

    // 기존 댓글 불러오기
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:author_id (
            username,
            display_name
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data || []);
      }
      setIsLoading(false);
    };

    fetchComments();

    // 실시간 댓글 구독
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        async (payload) => {
          // 새 댓글에 대한 프로필 정보 가져오기
          const { data: authorData } = await supabase
            .from('profiles')
            .select('username, display_name')
            .eq('id', payload.new.author_id)
            .single();

          const newComment = {
            ...payload.new,
            author: authorData
          } as RealtimeComment;

          setComments(prev => [...prev, newComment]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const addComment = async (content: string, isAnonymous: boolean = true) => {
    if (!user) return;

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
  };

  return {
    comments,
    isLoading,
    addComment,
  };
};
