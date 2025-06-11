
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 
            className="text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            onClick={() => navigate('/')}
          >
            Campusise
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};

export default Header;
