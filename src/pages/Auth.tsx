
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    displayName: '',
    university: '',
    department: '',
    studentId: ''
  });

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(signInData.email, signInData.password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    await signUp(signUpData.email, signUpData.password, {
      username: signUpData.username,
      display_name: signUpData.displayName,
      university: signUpData.university,
      department: signUpData.department,
      student_id: signUpData.studentId
    });
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Campusise</CardTitle>
          <CardDescription>글로벌 대학생 커뮤니티</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email">이메일</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="username">아이디</Label>
                  <Input
                    id="username"
                    value={signUpData.username}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">닉네임</Label>
                  <Input
                    id="displayName"
                    value={signUpData.displayName}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, displayName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="university">대학교</Label>
                  <Select onValueChange={(value) => setSignUpData(prev => ({ ...prev, university: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="대학교를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="서울대학교">서울대학교</SelectItem>
                      <SelectItem value="연세대학교">연세대학교</SelectItem>
                      <SelectItem value="고려대학교">고려대학교</SelectItem>
                      <SelectItem value="Harvard University">Harvard University</SelectItem>
                      <SelectItem value="MIT">MIT</SelectItem>
                      <SelectItem value="Stanford University">Stanford University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">학과</Label>
                  <Input
                    id="department"
                    value={signUpData.department}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, department: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="studentId">학번 (선택)</Label>
                  <Input
                    id="studentId"
                    value={signUpData.studentId}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, studentId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">비밀번호 확인</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? '가입 중...' : '회원가입'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
