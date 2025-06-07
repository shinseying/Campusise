
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Plus, User } from 'lucide-react';

const Groups = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allGroups = [
    { id: 1, name: '컴공 스터디', members: 12, maxMembers: 20, type: '스터디', description: '알고리즘 문제 해결' },
    { id: 2, name: '서울대 테니스', members: 8, maxMembers: 16, type: '운동', description: '매주 테니스 모임' },
    { id: 3, name: '영어 회화', members: 15, maxMembers: 15, type: '언어', description: '영어 실력 향상' },
  ];

  const myGroups = [
    { id: 1, name: '컴공 스터디', members: 12, maxMembers: 20, type: '스터디', role: '멤버' },
    { id: 2, name: '축구 동아리', members: 25, maxMembers: 30, type: '운동', role: '관리자' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => {}} />
      
      <main className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">그룹</h1>
                <Button size="sm" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>그룹 만들기</span>
                </Button>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('all')}
                  size="sm"
                >
                  전체 그룹
                </Button>
                <Button
                  variant={activeTab === 'my' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('my')}
                  size="sm"
                >
                  내 그룹 ({myGroups.length})
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="그룹 이름으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="p-4">
              {activeTab === 'all' && (
                <div className="space-y-4">
                  {allGroups.map((group) => (
                    <div key={group.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{group.name}</h3>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {group.type}
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          가입하기
                        </Button>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{group.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{group.members}/{group.maxMembers}명</span>
                        </div>
                        <span className={group.members >= group.maxMembers ? 'text-red-500' : 'text-green-500'}>
                          {group.members >= group.maxMembers ? '모집 완료' : '모집 중'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'my' && (
                <div className="space-y-4">
                  {myGroups.map((group) => (
                    <div key={group.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{group.name}</h3>
                          <div className="flex space-x-2">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {group.type}
                            </span>
                            <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                              group.role === '관리자' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {group.role}
                            </span>
                          </div>
                        </div>
                        <Button size="sm">
                          채팅 참여
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{group.members}/{group.maxMembers}명</span>
                        </div>
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

export default Groups;
