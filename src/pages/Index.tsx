
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BoardTabs from '@/components/BoardTabs';
import PostCard from '@/components/PostCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeBoard, setActiveBoard] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  // Determine board type for query
  let boardType: string | undefined;
  if (activeBoard !== 'all') {
    boardType = activeBoard;
  }
  
  const { data: posts, isLoading, error } = usePosts(boardType);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>게시글을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>게시글을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          {/* User welcome message */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">안녕하세요!</h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
              <Button onClick={signOut} variant="outline" size="sm">
                로그아웃
              </Button>
            </div>
          </div>
          
          <BoardTabs activeBoard={activeBoard} onBoardChange={setActiveBoard} />
          
          <div className="mt-4">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>게시글이 없습니다.</p>
                <p className="text-sm">첫 번째 글을 작성해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <FloatingActionButton />
    </div>
  );
};

export default Index;
