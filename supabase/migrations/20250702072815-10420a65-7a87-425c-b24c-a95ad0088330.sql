
-- Clear all user-generated data from the database
-- This will reset the database to a clean state while preserving the table structure

-- Clear dependent tables first (to avoid foreign key constraint issues)
DELETE FROM public.bookmarks;
DELETE FROM public.post_reactions;
DELETE FROM public.comments;
DELETE FROM public.group_chats;
DELETE FROM public.group_members;
DELETE FROM public.messages;
DELETE FROM public.notifications;
DELETE FROM public.user_presence;

-- Clear main content tables
DELETE FROM public.posts;
DELETE FROM public.friendships;
DELETE FROM public.groups;
DELETE FROM public.schedules;

-- Clear user profiles (this will also clear associated auth users)
DELETE FROM public.profiles;

-- Reset any auto-increment sequences if needed
-- (UUID tables don't need sequence resets, but if you had any serial columns, you'd reset them here)
