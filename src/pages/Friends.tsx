
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { User, UserPlus, Search } from 'lucide-react';

const Friends = () => {
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
              <h1 className="text-2xl font-bold">친구</h1>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                친구 추가
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="친구 검색..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">김대학</p>
                    <p className="text-sm text-gray-500">서울대학교 • 경영학과</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  메시지
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">이학생</p>
                    <p className="text-sm text-gray-500">연세대학교 • 컴퓨터공학과</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  메시지
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;
