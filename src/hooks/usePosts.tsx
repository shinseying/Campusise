
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Post {
  id: string;
  title: string;
  content: string;
  board_type: 'international' | 'campus' | 'department';
  university?: string;
  department?: string;
  images?: string[];
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  is_anonymous: boolean;
  created_at: string;
  author_id: string;
  profiles?: {
    username: string;
    display_name: string;
  };
}

export const usePosts = (boardType?: string, university?: string, department?: string) => {
  return useQuery({
    queryKey: ['posts', boardType, university, department],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            username,
            display_name
          )
        `)
        .order('created_at', { ascending: false });

      // Only apply board_type filter if it's a valid enum value
      if (boardType && ['international', 'campus', 'department'].includes(boardType)) {
        query = query.eq('board_type', boardType as 'international' | 'campus' | 'department');
      }
      if (university) {
        query = query.eq('university', university);
      }
      if (department) {
        query = query.eq('department', department);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Post[];
    }
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postData: {
      title: string;
      content: string;
      board_type: 'international' | 'campus' | 'department';
      university?: string;
      department?: string;
      is_anonymous?: boolean;
    }) => {
      if (!user) throw new Error('사용자 인증이 필요합니다.');

      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...postData,
          author_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "게시글 작성 완료",
        description: "게시글이 성공적으로 작성되었습니다."
      });
    },
    onError: (error) => {
      toast({
        title: "게시글 작성 실패",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const usePostReaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, reactionType }: { postId: string; reactionType: 'like' | 'dislike' }) => {
      if (!user) throw new Error('사용자 인증이 필요합니다.');

      // Check if reaction already exists
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existingReaction) {
        if (existingReaction.reaction_type === reactionType) {
          // Remove reaction if same type
          const { error } = await supabase
            .from('post_reactions')
            .delete()
            .eq('user_id', user.id)
            .eq('post_id', postId);
          if (error) throw error;
        } else {
          // Update reaction if different type
          const { error } = await supabase
            .from('post_reactions')
            .update({ reaction_type: reactionType })
            .eq('user_id', user.id)
            .eq('post_id', postId);
          if (error) throw error;
        }
      } else {
        // Create new reaction
        const { error } = await supabase
          .from('post_reactions')
          .insert([{
            user_id: user.id,
            post_id: postId,
            reaction_type: reactionType
          }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};
