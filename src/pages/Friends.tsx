
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Star, MessageCircle, User } from 'lucide-react';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');

  const friendRequests = [
    { id: 1, name: '김철수', university: 'Seoul National University', department: '컴퓨터공학과' },
    { id: 2, name: '이영희', university: 'Yonsei University', department: '경영학과' },
  ];

  const friends = [
    { id: 1, name: '박민수', university: 'Seoul National University', department: '전자공학과', isStarred: true },
    { id: 2, name: '최지은', university: 'Korea University', department: '심리학과', isStarred: false },
    { id: 3, name: '정현우', university: 'Seoul National University', department: '컴퓨터공학과', isStarred: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => {}} />
      
      <main className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold mb-4">친구</h1>
              
              <div className="flex space-x-2 mb-4">
                <Button
                  variant={activeTab === 'friends' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('friends')}
                  size="sm"
                >
                  친구 목록 ({friends.length})
                </Button>
                <Button
                  variant={activeTab === 'requests' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('requests')}
                  size="sm"
                >
                  친구 요청 ({friendRequests.length})
                </Button>
                <Button
                  variant={activeTab === 'search' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('search')}
                  size="sm"
                >
                  친구 찾기
                </Button>
              </div>
              
              {activeTab === 'search' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="이름 또는 아이디로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
            </div>
            
            <div className="p-4">
              {activeTab === 'requests' && (
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-gray-500">{request.university} • {request.department}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="default">수락</Button>
                        <Button size="sm" variant="outline">거절</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'friends' && (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{friend.name}</p>
                            {friend.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>
                          <p className="text-sm text-gray-500">{friend.university} • {friend.department}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'search' && (
                <div className="text-center py-8 text-gray-500">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>검색어를 입력하여 친구를 찾아보세요.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;
