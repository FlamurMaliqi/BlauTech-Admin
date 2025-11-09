-- Migration: Add new fields to events table
-- Run this in your Supabase SQL Editor

-- Add new columns to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS short_description text,
ADD COLUMN IF NOT EXISTS start_time time,
ADD COLUMN IF NOT EXISTS duration integer,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS format text DEFAULT 'in-person',
ADD COLUMN IF NOT EXISTS registration_url text,
ADD COLUMN IF NOT EXISTS registration_deadline timestamptz,
ADD COLUMN IF NOT EXISTS capacity integer,
ADD COLUMN IF NOT EXISTS organizer_name text,
ADD COLUMN IF NOT EXISTS organizer_contactinfo text,
ADD COLUMN IF NOT EXISTS requirements text;

-- Add check constraints for status
ALTER TABLE public.events
ADD CONSTRAINT events_status_check 
CHECK (status IN ('draft', 'published', 'cancelled', 'completed', 'postponed'));

-- Add check constraint for format
ALTER TABLE public.events
ADD CONSTRAINT events_format_check 
CHECK (format IN ('online', 'in-person', 'hybrid'));

-- Add check constraint for category (optional, you can add more categories)
-- ALTER TABLE public.events
-- ADD CONSTRAINT events_category_check 
-- CHECK (category IN ('workshop', 'conference', 'meetup', 'webinar', 'networking', 'training', 'hackathon', 'other'));

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);

-- Create index on start_date for faster date range queries
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);

