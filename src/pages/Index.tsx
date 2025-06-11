
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BoardTabs from '@/components/BoardTabs';
import RealtimePostCard from '@/components/RealtimePostCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeBoard, setActiveBoard] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  // 실시간 기능 초기화
  useRealtime();
  
  // Determine board type for query
  let boardType: string | undefined;
  if (activeBoard !== 'all') {
    boardType = activeBoard;
  }
  
  const { data: posts, isLoading, error } = usePosts(boardType);

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log('Index component mounted');
    console.log('User:', user);
    console.log('Posts:', posts);
    console.log('Is loading:', isLoading);
    console.log('Error:', error);
  }, [user, posts, isLoading, error]);

  // 사용자가 없으면 로딩 표시
  if (!user) {
    console.log('No user found, showing loading...');
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
    console.log('Posts loading...');
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <main className="pt-16 pb-20">
          <div className="max-w-2xl mx-auto px-4">
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
    console.error('Error loading posts:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <main className="pt-16 pb-20">
          <div className="max-w-2xl mx-auto px-4">
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

  console.log('Rendering main content with posts:', posts?.length || 0);

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

export default Index;
