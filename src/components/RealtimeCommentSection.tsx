
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageSquare } from 'lucide-react';
import { useRealtimeComments } from '@/hooks/useRealtimeComments';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface RealtimeCommentSectionProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RealtimeCommentSection = ({ postId, isOpen, onClose }: RealtimeCommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { comments, commentsCount, isLoading, addComment } = useRealtimeComments(postId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment(newComment, isAnonymous);
    setNewComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            댓글 ({commentsCount || 0})
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">댓글을 불러오는 중...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">첫 번째 댓글을 작성해보세요!</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {comment.is_anonymous ? '익' : comment.profiles?.display_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">
                      {comment.is_anonymous ? '익명' : comment.profiles?.display_name || '사용자'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), { 
                        addSuffix: true, 
                        locale: ko 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="border-t pt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              익명으로 작성
            </label>
          </div>
          <div className="flex space-x-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 min-h-[80px] resize-none"
            />
            <Button type="submit" size="sm" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RealtimeCommentSection;
