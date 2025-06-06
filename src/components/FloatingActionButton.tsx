
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatePostDialog from './CreatePostDialog';

const FloatingActionButton = () => {
  return (
    <CreatePostDialog>
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 campusise-button z-40"
        size="sm"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </CreatePostDialog>
  );
};

export default FloatingActionButton;
