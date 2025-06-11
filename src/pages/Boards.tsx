
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BoardTabs from '@/components/BoardTabs';
import RealtimePostCard from '@/components/RealtimePostCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Boards = () => {
  const [activeBoard, setActiveBoard] = useState('international');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 실시간 기능 초기화
  useRealtime();
  
  // Determine board type for query
  let boardType: string | undefined;
  if (activeBoard !== 'all') {
    boardType = activeBoard;
  }
  
  const { data: posts, isLoading, error } = usePosts(boardType);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div>사용자 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <main className="pt-16 pb-20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="mr-3"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">게시판</h1>
            </div>
            
            <BoardTabs activeTab={activeBoard} onTabChange={setActiveBoard} />
            
            <div className="mt-4 flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3">게시글을 불러오는 중...</span>
            </div>
          </div>
        </main>
        <FloatingActionButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <main className="pt-16 pb-20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="mr-3"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">게시판</h1>
            </div>
            
            <BoardTabs activeTab={activeBoard} onTabChange={setActiveBoard} />
            
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium">오류가 발생했습니다</h3>
              <p className="text-red-600 text-sm mt-1">게시글을 불러오는데 실패했습니다.</p>
              <p className="text-red-500 text-xs mt-2">{error?.message}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                size="sm" 
                className="mt-3"
              >
                새로고침
              </Button>
            </div>
          </div>
        </main>
        <FloatingActionButton />
      </div>
    );
  }

  const getBoardTitle = (board: string) => {
    switch (board) {
      case 'international':
        return '국제 게시판';
      case 'campus':
        return '교내 게시판';
      case 'department':
        return '과별 게시판';
      case 'popular':
        return '인기글';
      default:
        return '전체 게시판';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">{getBoardTitle(activeBoard)}</h1>
          </div>
          
          <BoardTabs activeTab={activeBoard} onTabChange={setActiveBoard} />
          
          <div className="mt-4">
            {posts && posts.length > 0 ? (
              <div>
                <div className="text-sm text-gray-500 mb-4">
                  총 {posts.length}개의 게시글
                </div>
                {posts.map((post) => (
                  <RealtimePostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
                <p className="text-lg mb-2">게시글이 없습니다.</p>
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

export default Boards;
