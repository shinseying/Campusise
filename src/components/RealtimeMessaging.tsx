
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Phone, Video } from 'lucide-react';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface RealtimeMessagingProps {
  chatPartner: {
    id: string;
    display_name: string;
    username: string;
  };
  messageType?: 'dm' | 'anonymous';
}

const RealtimeMessaging = ({ chatPartner, messageType = 'dm' }: RealtimeMessagingProps) => {
  const [newMessage, setNewMessage] = useState('');
  const { messages, isLoading, sendMessage } = useRealtimeMessages(chatPartner.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage, messageType, chatPartner.id);
    setNewMessage('');
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-blue-500 text-white">
                {messageType === 'anonymous' ? '익' : chatPartner.display_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {messageType === 'anonymous' ? '익명 대화' : chatPartner.display_name}
              </CardTitle>
              {messageType === 'dm' && (
                <p className="text-sm text-gray-500">@{chatPartner.username}</p>
              )}
            </div>
          </div>
          
          {messageType === 'dm' && (
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">메시지를 불러오는 중...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              첫 번째 메시지를 보내보세요!
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender_id === chatPartner.id ? false : true;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatDistanceToNow(new Date(message.created_at), { 
                        addSuffix: true, 
                        locale: ko 
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1"
            />
            <Button type="submit" size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RealtimeMessaging;
