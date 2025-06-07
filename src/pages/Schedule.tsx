
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { useSchedules } from '@/hooks/useSchedules';

const Schedule = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: schedules = [], isLoading } = useSchedules();

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const getScheduleForTimeSlot = (day: number, hour: number) => {
    return schedules.find(schedule => {
      const startHour = parseInt(schedule.start_time.split(':')[0]);
      const endHour = parseInt(schedule.end_time.split(':')[0]);
      return schedule.day_of_week === day && hour >= startHour && hour < endHour;
    });
  };

  const timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const days = ['월', '화', '수', '목', '금'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={handleMenuClick} />
        <main className="pt-16 pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <p>시간표를 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                시간표
              </h1>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                수업 추가
              </Button>
            </div>

            {/* Schedule Grid */}
            <div className="overflow-x-auto mb-8">
              <div className="min-w-full">
                {/* Header */}
                <div className="grid grid-cols-6 gap-2 mb-4">
                  <div className="text-center font-medium text-gray-500 text-sm py-2">시간</div>
                  {days.map((day, index) => (
                    <div key={day} className="text-center font-medium text-gray-500 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                {timeSlots.map((hour) => (
                  <div key={hour} className="grid grid-cols-6 gap-2 mb-2">
                    <div className="text-center text-sm text-gray-500 py-4 font-medium">
                      {hour}:00
                    </div>
                    {[1, 2, 3, 4, 5].map((day) => {
                      const schedule = getScheduleForTimeSlot(day, hour);
                      return (
                        <div
                          key={day}
                          className="border border-gray-200 rounded p-2 min-h-[80px] bg-gray-50 hover:bg-gray-100 cursor-pointer relative"
                        >
                          {schedule && (
                            <div className="bg-blue-100 text-blue-800 p-2 rounded text-xs h-full">
                              <div className="font-medium truncate">{schedule.course_name}</div>
                              {schedule.professor && (
                                <div className="text-xs mt-1 truncate">{schedule.professor}</div>
                              )}
                              {schedule.classroom && (
                                <div className="text-xs truncate">{schedule.classroom}</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Course List */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">수강 과목 목록</h3>
              {schedules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>등록된 수업이 없습니다.</p>
                  <p className="text-sm">수업 추가 버튼을 눌러 시간표를 만들어보세요.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{schedule.course_name}</h4>
                        <p className="text-sm text-gray-500">
                          {schedule.professor && `${schedule.professor} • `}
                          {days[schedule.day_of_week - 1]} {schedule.start_time}-{schedule.end_time}
                          {schedule.classroom && ` • ${schedule.classroom}`}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
