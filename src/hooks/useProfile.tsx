
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  username_id: string;
  university: string;
  department: string;
  bio?: string;
  profile_image_url?: string;
  student_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      if (!user) throw new Error('사용자 인증이 필요합니다.');

      // 먼저 프로필이 존재하는지 확인
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // 프로필이 존재하면 업데이트
        const { data, error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // 프로필이 없으면 생성
        const newProfile = {
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          display_name: profileData.display_name || '익명의 대학생',
          username_id: user.email?.split('@')[0] || 'user',
          university: 'Unknown University',
          department: 'Unknown Department',
          bio: profileData.bio || '안녕하세요!',
          ...profileData
        };

        const { data, error } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필이 성공적으로 업데이트되었습니다."
      });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: "프로필 업데이트 실패",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
