
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
  const channelsRef = useRef<any[]>([]);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!postId || isSubscribedRef.current) return;

    // 기존 채널들 정리
    channelsRef.current.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.log('Error removing channel:', error);
      }
    });
    channelsRef.current = [];
    isSubscribedRef.current = false;

    // 기존 댓글 불러오기
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

      // 게시글의 댓글 수도 가져오기
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

    // 고유한 채널 이름으로 실시간 댓글 구독
    const commentsChannelName = `comments-${postId}-${Date.now()}-${Math.random()}`;
    const commentsChannel = supabase
      .channel(commentsChannelName)
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
            // 새 댓글에 대한 프로필 정보 가져오기
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
      );

    // 게시글 댓글 수 업데이트 구독
    const postsChannelName = `post-comments-${postId}-${Date.now()}-${Math.random()}`;
    const postsChannel = supabase
      .channel(postsChannelName)
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
      );

    // 채널 구독
    try {
      commentsChannel.subscribe((status) => {
        console.log('Comments channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
      });
      
      postsChannel.subscribe((status) => {
        console.log('Posts channel subscription status:', status);
      });

      channelsRef.current = [commentsChannel, postsChannel];
    } catch (error) {
      console.error('Error subscribing to channels:', error);
    }

    return () => {
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.log('Error removing channel on cleanup:', error);
        }
      });
      channelsRef.current = [];
      isSubscribedRef.current = false;
    };
  }, [postId]);

  const addComment = async (content: string, isAnonymous: boolean = true) => {
    if (!user) return;

    console.log('Adding comment:', content, 'anonymous:', isAnonymous);

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
    commentsCount,
    isLoading,
    addComment,
  };
};
