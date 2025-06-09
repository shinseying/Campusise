
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useCreateSchedule } from '@/hooks/useSchedules';

const AddScheduleDialog = () => {
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [professor, setProfessor] = useState('');
  const [classroom, setClassroom] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const createSchedule = useCreateSchedule();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseName || !dayOfWeek || !startTime || !endTime) {
      return;
    }

    createSchedule.mutate({
      course_name: courseName,
      professor: professor || undefined,
      classroom: classroom || undefined,
      day_of_week: parseInt(dayOfWeek),
      start_time: startTime,
      end_time: endTime,
      semester: semester || undefined,
      year: parseInt(year)
    }, {
      onSuccess: () => {
        setOpen(false);
        setCourseName('');
        setProfessor('');
        setClassroom('');
        setDayOfWeek('');
        setStartTime('');
        setEndTime('');
        setSemester('');
        setYear(new Date().getFullYear().toString());
      }
    });
  };

  const days = [
    { value: '1', label: '월요일' },
    { value: '2', label: '화요일' },
    { value: '3', label: '수요일' },
    { value: '4', label: '목요일' },
    { value: '5', label: '금요일' }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          수업 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 수업 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseName">수업명 *</Label>
            <Input
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="예: 데이터구조"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="professor">교수명</Label>
            <Input
              id="professor"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="예: 김교수"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="classroom">강의실</Label>
            <Input
              id="classroom"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
              placeholder="예: 공학관 101"
            />
          </div>
          
          <div className="space-y-2">
            <Label>요일 *</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek} required>
              <SelectTrigger>
                <SelectValue placeholder="요일을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">시작 시간 *</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">종료 시간 *</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">학기</Label>
              <Input
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="예: 1학기"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">년도</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" disabled={createSchedule.isPending}>
              {createSchedule.isPending ? '추가 중...' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleDialog;
