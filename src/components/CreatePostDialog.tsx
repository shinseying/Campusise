
import { useState } from 'react';
import { useCreatePost } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
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
  const createPost = useCreatePost();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    board_type: 'international' as 'international' | 'campus' | 'department',
    university: '',
    department: '',
    is_anonymous: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    await createPost.mutateAsync(formData);
    setFormData({
      title: '',
      content: '',
      board_type: 'international',
      university: '',
      department: '',
      is_anonymous: true
    });
    setOpen(false);
  };

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
                <SelectItem value="campus">교내 게시판</SelectItem>
                <SelectItem value="department">과별 게시판</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.board_type === 'campus' && (
            <div>
              <Label htmlFor="university">대학교</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                placeholder="대학교명을 입력하세요"
              />
            </div>
          )}

          {formData.board_type === 'department' && (
            <>
              <div>
                <Label htmlFor="university">대학교</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                  placeholder="대학교명을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="department">학과</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="학과명을 입력하세요"
                />
              </div>
            </>
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
