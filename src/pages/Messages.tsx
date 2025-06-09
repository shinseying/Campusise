
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RealtimeMessaging from '@/components/RealtimeMessaging';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Plus } from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';

const Messages = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dm' | 'anonymous'>('dm');
  
  // 실시간 기능 초기화
  useRealtime();

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  // 예시 친구 목록 (실제로는 친구 데이터를 가져와야 함)
  const friends = [
    { id: '1', display_name: '김대학', username: 'kim_univ' },
    { id: '2', display_name: '이캠퍼스', username: 'lee_campus' },
    { id: '3', display_name: '박학생', username: 'park_student' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {selectedChat ? (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedChat(null)}
                className="mb-4"
              >
                ← 대화 목록으로 돌아가기
              </Button>
              <RealtimeMessaging 
                chatPartner={selectedChat} 
                messageType={activeTab}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold mb-6">메시지</h1>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button 
                  variant={activeTab === 'dm' ? 'default' : 'outline'} 
                  className="p-6 h-auto flex-col"
                  onClick={() => setActiveTab('dm')}
                >
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <span>DM</span>
                  <span className="text-sm text-gray-500">친구와의 대화</span>
                </Button>
                <Button 
                  variant={activeTab === 'anonymous' ? 'default' : 'outline'} 
                  className="p-6 h-auto flex-col"
                  onClick={() => setActiveTab('anonymous')}
                >
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <span>쪽지</span>
                  <span className="text-sm text-gray-500">익명 대화</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {activeTab === 'dm' ? 'DM 대화' : '익명 쪽지'}
                  </h2>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    새 대화
                  </Button>
                </div>

                {activeTab === 'dm' ? (
                  friends.map((friend) => (
                    <div 
                      key={friend.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedChat(friend)}
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{friend.display_name}</p>
                        <p className="text-sm text-gray-500">@{friend.username}</p>
                      </div>
                      <span className="text-xs text-gray-400">온라인</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>익명 쪽지 대화가 없습니다.</p>
                    <p className="text-sm">새로운 익명 대화를 시작해보세요.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;
