
import React from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { User, Edit, Settings } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => {}} />
      
      <main className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">프로필</h1>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                편집
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">익명의 대학생</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500">Seoul National University • 컴퓨터공학과</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">소개</h3>
                <p className="text-gray-600">안녕하세요! 컴퓨터공학과 학생입니다.</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">42</p>
                  <p className="text-sm text-gray-500">게시글</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">128</p>
                  <p className="text-sm text-gray-500">친구</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">15</p>
                  <p className="text-sm text-gray-500">그룹</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Button onClick={signOut} variant="destructive" className="w-full">
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
