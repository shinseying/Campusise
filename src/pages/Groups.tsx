
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Group, Plus, Search } from 'lucide-react';

const Groups = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">그룹</h1>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                그룹 생성
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="그룹 검색..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">컴퓨터공학과 스터디 그룹</h3>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">공개</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">알고리즘 문제 해결을 위한 스터디 그룹입니다.</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>멤버 24명</span>
                  <Button variant="outline" size="sm">
                    참가하기
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">국제교류 동아리</h3>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">조건부</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">다양한 국가의 학생들과 교류하는 동아리입니다.</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>멤버 156명</span>
                  <Button variant="outline" size="sm">
                    지원하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Groups;
