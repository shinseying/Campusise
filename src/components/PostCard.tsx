
import React from 'react';
import { Heart, MessageCircle, Bookmark, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  title: string;
  content: string;
  author: string;
  board: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const PostCard = ({ 
  title, 
  content, 
  author, 
  board, 
  likes, 
  comments, 
  timeAgo,
  isLiked = false,
  isBookmarked = false 
}: PostCardProps) => {
  return (
    <div className="campusise-card p-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-primary bg-campusise-blue-light px-2 py-1 rounded-full">
          {board}
        </span>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>
      
      <div>
        <h3 className="font-semibold text-base mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{content}</p>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{author}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-xs">{likes}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
