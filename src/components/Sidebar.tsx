
import React from 'react';
import { X, User, Users, MessageSquare, FileText, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">메뉴</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/profile')}
            >
              <User className="h-5 w-5 mr-3" />
              프로필
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/friends')}
            >
              <Users className="h-5 w-5 mr-3" />
              친구
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/messages')}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              메시지
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/schedule')}
            >
              <Calendar className="h-5 w-5 mr-3" />
              시간표
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/groups')}
            >
              <Users className="h-5 w-5 mr-3" />
              그룹
            </Button>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">게시판</h3>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => handleNavigation('/boards')}
              >
                <FileText className="h-4 w-4 mr-3" />
                국제 게시판
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => handleNavigation('/boards')}
              >
                <FileText className="h-4 w-4 mr-3" />
                교내 게시판
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => handleNavigation('/boards')}
              >
                <FileText className="h-4 w-4 mr-3" />
                과별 게시판
              </Button>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-5 w-5 mr-3" />
                설정
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
