
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Schedule {
  id: string;
  course_name: string;
  professor?: string;
  classroom?: string;
  day_of_week: number; // 1-5 (Monday-Friday)
  start_time: string;
  end_time: string;
  semester?: string;
  year?: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const useSchedules = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['schedules', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as Schedule[];
    },
    enabled: !!user
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (scheduleData: Omit<Schedule, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('사용자 인증이 필요합니다.');

      const { data, error } = await supabase
        .from('schedules')
        .insert([{
          ...scheduleData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast({
        title: "수업 추가 완료",
        description: "시간표에 수업이 추가되었습니다."
      });
    },
    onError: (error) => {
      toast({
        title: "수업 추가 실패",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...scheduleData }: Partial<Schedule> & { id: string }) => {
      const { data, error } = await supabase
        .from('schedules')
        .update(scheduleData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast({
        title: "수업 수정 완료",
        description: "시간표가 업데이트되었습니다."
      });
    },
    onError: (error) => {
      toast({
        title: "수업 수정 실패",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast({
        title: "수업 삭제 완료",
        description: "시간표에서 수업이 삭제되었습니다."
      });
    },
    onError: (error) => {
      toast({
        title: "수업 삭제 실패",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
