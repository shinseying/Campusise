
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share, Bookmark, ThumbsDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRealtimePostReactions } from '@/hooks/useRealtimePostReactions';
import RealtimeCommentSection from './RealtimeCommentSection';
import { Post } from '@/hooks/usePosts';

interface RealtimePostCardProps {
  post: Post;
}

const RealtimePostCard = ({ post }: RealtimePostCardProps) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { likesCount, dislikesCount, userReaction, toggleReaction } = useRealtimePostReactions(post.id);

  const displayName = post.is_anonymous ? '익명' : (post.profiles?.display_name || '사용자');

  return (
    <>
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-500 text-white">
                {post.is_anonymous ? '익' : displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{displayName}</span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.created_at), { 
                    addSuffix: true, 
                    locale: ko 
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {post.board_type === 'international' && '국제 게시판'}
                {post.board_type === 'campus' && '교내 게시판'}
                {post.board_type === 'department' && '과별 게시판'}
              </p>
            </div>
          </div>

          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {post.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`게시글 이미지 ${index + 1}`}
                  className="rounded-lg object-cover h-32 w-full"
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReaction('like')}
                className={`flex items-center space-x-1 ${
                  userReaction === 'like' ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                <Heart className={`h-4 w-4 ${userReaction === 'like' ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReaction('dislike')}
                className={`flex items-center space-x-1 ${
                  userReaction === 'dislike' ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                <ThumbsDown className={`h-4 w-4 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
                <span>{dislikesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCommentOpen(true)}
                className="flex items-center space-x-1 text-gray-600"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments_count}</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <RealtimeCommentSection
        postId={post.id}
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
      />
    </>
  );
};

export default RealtimePostCard;
