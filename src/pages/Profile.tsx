
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { User, Edit, Calendar, Plus } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("익명의 대학생");
  const [bio, setBio] = useState("안녕하세요! 컴퓨터공학과 학생입니다.");
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule'>('profile');

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleEditClick = () => {
    if (isEditing) {
      // Save changes
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveBio = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

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
                  <Button variant="outline" size="sm" onClick={handleEditClick}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? '저장' : '편집'}
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
                    <p className="text-gray-600">@user_12345678</p>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500">Seoul National University • 컴퓨터공학과</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">소개</h3>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full p-3 border rounded-lg resize-none"
                          rows={3}
                          placeholder="자기소개를 입력해주세요..."
                        />
                        <Button onClick={handleSaveBio} size="sm">
                          저장
                        </Button>
                      </div>
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
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    수업 추가
                  </Button>
                </div>

                {/* Schedule Grid */}
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Time slots header */}
                    <div className="grid grid-cols-6 gap-2 mb-4">
                      <div className="text-center font-medium text-gray-500 text-sm">시간</div>
                      <div className="text-center font-medium text-gray-500 text-sm">월</div>
                      <div className="text-center font-medium text-gray-500 text-sm">화</div>
                      <div className="text-center font-medium text-gray-500 text-sm">수</div>
                      <div className="text-center font-medium text-gray-500 text-sm">목</div>
                      <div className="text-center font-medium text-gray-500 text-sm">금</div>
                    </div>

                    {/* Schedule rows */}
                    {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) => (
                      <div key={hour} className="grid grid-cols-6 gap-2 mb-2">
                        <div className="text-center text-sm text-gray-500 py-2">
                          {hour}:00
                        </div>
                        {[1, 2, 3, 4, 5].map((day) => (
                          <div
                            key={day}
                            className="border border-gray-200 rounded p-2 min-h-[60px] bg-gray-50 hover:bg-gray-100 cursor-pointer"
                          >
                            {/* Sample class for demonstration */}
                            {hour === 10 && day === 1 && (
                              <div className="bg-blue-100 text-blue-800 p-1 rounded text-xs">
                                <div className="font-medium">데이터구조</div>
                                <div className="text-xs">김교수</div>
                                <div className="text-xs">공학관 101</div>
                              </div>
                            )}
                            {hour === 14 && day === 3 && (
                              <div className="bg-green-100 text-green-800 p-1 rounded text-xs">
                                <div className="font-medium">알고리즘</div>
                                <div className="text-xs">이교수</div>
                                <div className="text-xs">공학관 201</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current courses list */}
                <div className="mt-8">
                  <h3 className="font-medium text-gray-900 mb-4">수강 과목</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">데이터구조</p>
                        <p className="text-sm text-gray-500">김교수 • 월 10:00-12:00 • 공학관 101</p>
                      </div>
                      <Button variant="outline" size="sm">
                        편집
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">알고리즘</p>
                        <p className="text-sm text-gray-500">이교수 • 수 14:00-16:00 • 공학관 201</p>
                      </div>
                      <Button variant="outline" size="sm">
                        편집
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
