
import React from 'react';
import { X, User, Users, MessageSquare, Calendar, Group } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: User, label: '프로필', id: 'profile' },
  { icon: Users, label: '친구', id: 'friends' },
  { icon: MessageSquare, label: '메시지', id: 'messages' },
  { icon: Calendar, label: '게시판', id: 'board' },
  { icon: Group, label: '그룹', id: 'groups' },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      <div className={`fixed left-0 top-0 h-full w-80 bg-background border-r z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">메뉴</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center gap-3 p-3 bg-campusise-blue-light rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">익명의 대학생</p>
                <p className="text-sm text-muted-foreground">Seoul National University</p>
              </div>
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
