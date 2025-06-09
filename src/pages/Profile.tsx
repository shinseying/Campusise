
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useSchedules } from '@/hooks/useSchedules';
import { Button } from '@/components/ui/button';
import { User, Edit, Calendar, Plus } from 'lucide-react';
import AddScheduleDialog from '@/components/AddScheduleDialog';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: schedules = [], isLoading: schedulesLoading } = useSchedules();
  const updateProfile = useUpdateProfile();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule'>('profile');

  // Update local state when profile data is loaded
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setBio(profile.bio || "안녕하세요! 컴퓨터공학과 학생입니다.");
    }
  }, [profile]);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleEditClick = () => {
    if (isEditing) {
      // Save changes
      updateProfile.mutate({
        display_name: displayName,
        bio: bio
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
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

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={handleMenuClick} />
        <main className="pt-16 pb-20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <p>프로필을 불러오는 중...</p>
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
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Tab Navigation */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 px-4 text-center ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500'
                }`}
              >
                프로필
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 py-3 px-4 text-center ${
                  activeTab === 'schedule'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-1" />
                시간표
              </button>
            </div>

            {activeTab === 'profile' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">프로필</h1>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEditClick}
                    disabled={updateProfile.isPending}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? (updateProfile.isPending ? '저장 중...' : '저장') : '편집'}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="text-xl font-semibold border rounded px-2 py-1 mb-1"
                        placeholder="닉네임을 입력하세요"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold">{displayName}</h2>
                    )}
                    <p className="text-gray-600">@{profile?.username_id}</p>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500">{profile?.university} • {profile?.department}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">소개</h3>
                    {isEditing ? (
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={3}
                        placeholder="자기소개를 입력해주세요..."
                      />
                    ) : (
                      <p className="text-gray-600">{bio}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">42</p>
                      <p className="text-sm text-gray-500">게시글</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">128</p>
                      <p className="text-sm text-gray-500">친구</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">15</p>
                      <p className="text-sm text-gray-500">그룹</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <Button onClick={signOut} variant="destructive" className="w-full">
                    로그아웃
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">시간표</h1>
                  <AddScheduleDialog />
                </div>

                {schedulesLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <p>시간표를 불러오는 중...</p>
                  </div>
                ) : (
                  <>
                    {/* Schedule Grid */}
                    <div className="overflow-x-auto">
                      <div className="min-w-full">
                        {/* Time slots header */}
                        <div className="grid grid-cols-6 gap-2 mb-4">
                          <div className="text-center font-medium text-gray-500 text-sm">시간</div>
                          {days.map((day) => (
                            <div key={day} className="text-center font-medium text-gray-500 text-sm">{day}</div>
                          ))}
                        </div>

                        {/* Schedule rows */}
                        {timeSlots.map((hour) => (
                          <div key={hour} className="grid grid-cols-6 gap-2 mb-2">
                            <div className="text-center text-sm text-gray-500 py-2">
                              {hour}:00
                            </div>
                            {[1, 2, 3, 4, 5].map((day) => {
                              const schedule = getScheduleForTimeSlot(day, hour);
                              return (
                                <div
                                  key={day}
                                  className="border border-gray-200 rounded p-2 min-h-[60px] bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                >
                                  {schedule && (
                                    <div className="bg-blue-100 text-blue-800 p-1 rounded text-xs">
                                      <div className="font-medium">{schedule.course_name}</div>
                                      {schedule.professor && <div className="text-xs">{schedule.professor}</div>}
                                      {schedule.classroom && <div className="text-xs">{schedule.classroom}</div>}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current courses list */}
                    <div className="mt-8">
                      <h3 className="font-medium text-gray-900 mb-4">수강 과목</h3>
                      {schedules.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>등록된 수업이 없습니다.</p>
                          <p className="text-sm">수업 추가 버튼을 눌러 시간표를 만들어보세요.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {schedules.map((schedule) => (
                            <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{schedule.course_name}</p>
                                <p className="text-sm text-gray-500">
                                  {schedule.professor && `${schedule.professor} • `}
                                  {days[schedule.day_of_week - 1]} {schedule.start_time}-{schedule.end_time}
                                  {schedule.classroom && ` • ${schedule.classroom}`}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                편집
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
