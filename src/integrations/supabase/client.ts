// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://szkepqwdklbwdzqghwlx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6a2VwcXdka2xid2R6cWdod2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMDQyODcsImV4cCI6MjA2NDc4MDI4N30.UGTWWvna26wTHdMMilRrtpKv51XAZRaM9PheBlLkmT4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);