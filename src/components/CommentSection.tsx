
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CommentSection = ({ postId, isOpen, onClose }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      content: '좋은 글이네요! 도움이 되었습니다.',
      author: '익명',
      isAnonymous: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: '2',
      content: '저도 같은 생각입니다. 공감해요.',
      author: '익명',
      isAnonymous: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
  ]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: '익명',
      isAnonymous: true,
      createdAt: new Date().toISOString(),
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: ko 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full max-h-[80vh] rounded-t-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">댓글 {comments.length}개</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <div className="flex space-x-2">
            <Input
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
              className="flex-1"
            />
            <Button onClick={handleSubmitComment} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
