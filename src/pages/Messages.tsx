
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, User, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('dm');
  const [selectedChat, setSelectedChat] = useState(null);

  const dmChats = [
    { id: 1, name: '박민수', lastMessage: '수업 언제 끝나?', time: '오후 2:30', unread: 2 },
    { id: 2, name: '최지은', lastMessage: '과제 같이 할래?', time: '오전 11:15', unread: 0 },
  ];

  const anonymousChats = [
    { id: 1, name: '익명의 사용자', lastMessage: '안녕하세요!', time: '오후 1:45', unread: 1 },
    { id: 2, name: '익명의 사용자', lastMessage: '도움이 필요해요', time: '오전 10:20', unread: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => {}} />
      
      <main className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold mb-4">메시지</h1>
              
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === 'dm' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('dm')}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>DM</span>
                </Button>
                <Button
                  variant={activeTab === 'anonymous' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('anonymous')}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>쪽지</span>
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              {activeTab === 'dm' && (
                <div className="space-y-3">
                  {dmChats.map((chat) => (
                    <div key={chat.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{chat.name}</p>
                          <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{chat.time}</p>
                        {chat.unread > 0 && (
                          <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'anonymous' && (
                <div className="space-y-3">
                  {anonymousChats.map((chat) => (
                    <div key={chat.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{chat.name}</p>
                          <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{chat.time}</p>
                        {chat.unread > 0 && (
                          <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {((activeTab === 'dm' && dmChats.length === 0) || (activeTab === 'anonymous' && anonymousChats.length === 0)) && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>아직 메시지가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
