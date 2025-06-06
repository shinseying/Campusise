
import React from 'react';
import { Button } from '@/components/ui/button';

const boardTypes = [
  { id: 'all', label: '전체', color: 'bg-accent text-accent-foreground' },
  { id: 'popular', label: '인기글', color: 'bg-accent text-accent-foreground' },
  { id: 'international', label: '국제 게시판', color: 'bg-primary text-primary-foreground' },
  { id: 'campus', label: '교내 게시판', color: 'bg-secondary text-secondary-foreground' },
  { id: 'department', label: '과별 게시판', color: 'bg-muted text-muted-foreground' },
];

interface BoardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BoardTabs = ({ activeTab, onTabChange }: BoardTabsProps) => {
  return (
    <div className="flex gap-2 p-4 overflow-x-auto">
      {boardTypes.map((board) => (
        <Button
          key={board.id}
          variant={activeTab === board.id ? "default" : "outline"}
          size="sm"
          onClick={() => onTabChange(board.id)}
          className={`whitespace-nowrap transition-all duration-200 ${
            activeTab === board.id 
              ? board.color
              : 'border-border hover:bg-muted'
          }`}
        >
          {board.label}
        </Button>
      ))}
    </div>
  );
};

export default BoardTabs;
