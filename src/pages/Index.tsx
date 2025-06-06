
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BoardTabs from '@/components/BoardTabs';
import PostCard from '@/components/PostCard';
import FloatingActionButton from '@/components/FloatingActionButton';

const mockPosts = [
  {
    id: 1,
    title: "새 학기 친구 만들기 어떻게 하나요? 😭",
    content: "안녕하세요! 새 학기가 시작됐는데 아직 친구가 없어서 걱정이에요. 혹시 좋은 방법 있을까요? 같은 과 사람들과 친해지고 싶은데 말 걸기가 너무 어려워요...",
    author: "익명123",
    board: "교내 게시판",
    likes: 24,
    comments: 12,
    timeAgo: "3시간 전",
    isLiked: true
  },
  {
    id: 2,
    title: "해외 교환학생 준비 중인데 조언 부탁드려요!",
    content: "내년에 미국으로 교환학생 가려고 하는데, 준비해야 할 것들이 너무 많아서 막막해요. 경험 있으신 분들 조언 좀 해주세요!",
    author: "글로벌꿈나무",
    board: "국제 게시판",
    likes: 45,
    comments: 28,
    timeAgo: "5시간 전",
    isBookmarked: true
  },
  {
    id: 3,
    title: "컴퓨터공학과 전공 수업 난이도 궁금해요",
    content: "다음 학기에 자료구조론 수강하려는데 난이도가 어떤가요? 미리 공부해둘 것들이 있을까요?",
    author: "코딩초보",
    board: "과별 게시판",
    likes: 18,
    comments: 7,
    timeAgo: "1일 전"
  },
  {
    id: 4,
    title: "대학생활 중 가장 후회하는 것",
    content: "벌써 4학년인데 돌이켜보니 후회되는 것들이 많아요. 후배들에게 조언해주고 싶어서 글 써봅니다.",
    author: "선배의조언",
    board: "교내 게시판",
    likes: 89,
    comments: 34,
    timeAgo: "2일 전",
    isLiked: true
  },
  {
    id: 5,
    title: "기숙사 vs 자취 고민 중이에요",
    content: "2학년 올라가면서 기숙사에서 나갈지 말지 고민이에요. 자취 경험 있으신 분들 후기 들려주세요!",
    author: "고민중",
    board: "교내 게시판",
    likes: 31,
    comments: 19,
    timeAgo: "3일 전"
  }
];

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const filteredPosts = activeTab === 'popular' 
    ? mockPosts.filter(post => post.likes > 30)
    : mockPosts;

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      
      <main className="pb-20">
        <BoardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="px-4 space-y-4">
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {activeTab === 'popular' ? '🔥 인기글' : '📚 최신글'}
            </h2>
            <p className="text-sm text-muted-foreground">
              전 세계 대학생들과 함께 소통해보세요
            </p>
          </div>
          
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              content={post.content}
              author={post.author}
              board={post.board}
              likes={post.likes}
              comments={post.comments}
              timeAgo={post.timeAgo}
              isLiked={post.isLiked}
              isBookmarked={post.isBookmarked}
            />
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">아직 글이 없어요</p>
              <p className="text-sm text-muted-foreground mt-1">
                첫 번째 글을 작성해보세요!
              </p>
            </div>
          )}
        </div>
      </main>
      
      <FloatingActionButton />
    </div>
  );
};

export default Index;
