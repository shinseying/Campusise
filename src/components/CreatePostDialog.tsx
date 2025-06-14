
import { useState } from 'react';
import { useCreatePost } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';

interface CreatePostDialogProps {
  children?: React.ReactNode;
}

const CreatePostDialog = ({ children }: CreatePostDialogProps) => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const createPost = useCreatePost();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    board_type: 'international' as 'international' | 'campus' | 'department',
    is_anonymous: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 게시판 타입에 따라 대학교/학과 정보 자동 설정
    const postData = {
      ...formData,
      university: formData.board_type === 'campus' ? profile.university : undefined,
      department: formData.board_type === 'department' ? profile.department : undefined,
    };

    await createPost.mutateAsync(postData);
    setFormData({
      title: '',
      content: '',
      board_type: 'international',
      is_anonymous: true
    });
    setOpen(false);
  };

  if (!profile) {
    return null; // 프로필이 로드되지 않으면 렌더링하지 않음
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="campusise-button">
            <Plus className="w-4 h-4 mr-2" />
            글쓰기
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>새 게시글 작성</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="board_type">게시판</Label>
            <Select
              value={formData.board_type}
              onValueChange={(value: 'international' | 'campus' | 'department') => 
                setFormData(prev => ({ ...prev, board_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="international">국제 게시판</SelectItem>
                <SelectItem value="campus">교내 게시판 ({profile.university})</SelectItem>
                <SelectItem value="department">과별 게시판 ({profile.department})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.board_type === 'campus' && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>{profile.university}</strong> 교내 게시판에 게시됩니다.
              </p>
            </div>
          )}

          {formData.board_type === 'department' && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>{profile.department}</strong> 과별 게시판에 게시됩니다.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="내용을 입력하세요"
              rows={5}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_anonymous: checked }))}
            />
            <Label htmlFor="anonymous">익명 게시</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" disabled={createPost.isPending}>
              {createPost.isPending ? '작성 중...' : '작성하기'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
