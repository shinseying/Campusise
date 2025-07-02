
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Post } from '@/hooks/usePosts';
import { useRealtimePostReactions } from '@/hooks/useRealtimePostReactions';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const { likesCount, dislikesCount, userReaction, toggleReaction } = useRealtimePostReactions(post.id);

  const handleReaction = (reactionType: 'like' | 'dislike') => {
    toggleReaction(reactionType);
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: ko 
    });
  };

  return (
    <>
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {post.is_anonymous ? '익' : post.profiles?.display_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {post.is_anonymous ? '익명' : post.profiles?.display_name || '사용자'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(post.created_at)}
                </p>
              </div>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {post.board_type === 'international' && '국제'}
              {post.board_type === 'campus' && '교내'}
              {post.board_type === 'department' && '과별'}
            </span>
          </div>
          
          <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>
          
          {post.university && (
            <p className="text-xs text-gray-500 mb-2">
              {post.university} {post.department && `• ${post.department}`}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-1 text-gray-600 hover:text-blue-600 ${
                  userReaction === 'like' ? 'text-blue-600 bg-blue-50' : ''
                }`}
                onClick={() => handleReaction('like')}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs">{likesCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-1 text-gray-600 hover:text-red-600 ${
                  userReaction === 'dislike' ? 'text-red-600 bg-red-50' : ''
                }`}
                onClick={() => handleReaction('dislike')}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-xs">{dislikesCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
                onClick={() => setIsCommentSectionOpen(true)}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{post.comments_count}</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600"
              >
                <Share className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-yellow-600"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CommentSection
        postId={post.id}
        isOpen={isCommentSectionOpen}
        onClose={() => setIsCommentSectionOpen(false)}
      />
    </>
  );
};

export default PostCard;
