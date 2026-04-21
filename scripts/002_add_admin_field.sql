-- Add is_admin field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set k4d1r as admin (find by username)
UPDATE public.profiles 
SET is_admin = true 
WHERE username = 'k4d1r';
