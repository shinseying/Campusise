
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { MessageSquare, User } from 'lucide-react';

const Messages = () => {
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
            <h1 className="text-2xl font-bold mb-6">메시지</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button variant="outline" className="p-6 h-auto flex-col">
                <MessageSquare className="h-8 w-8 mb-2" />
                <span>DM</span>
                <span className="text-sm text-gray-500">친구와의 대화</span>
              </Button>
              <Button variant="outline" className="p-6 h-auto flex-col">
                <MessageSquare className="h-8 w-8 mb-2" />
                <span>쪽지</span>
                <span className="text-sm text-gray-500">익명 대화</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">김대학</p>
                  <p className="text-sm text-gray-500">안녕하세요! 과제 관련해서...</p>
                </div>
                <span className="text-xs text-gray-400">2분 전</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">익명의 사용자</p>
                  <p className="text-sm text-gray-500">혹시 이번 시험 범위 아시나요?</p>
                </div>
                <span className="text-xs text-gray-400">10분 전</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
