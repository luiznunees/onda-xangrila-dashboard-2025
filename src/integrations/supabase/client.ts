// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ldxyzfnzjvzegdfjoqqg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkeHl6Zm56anZ6ZWdkZmpvcXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MTEzNjAsImV4cCI6MjA2MTI4NzM2MH0.b-HrHTIqqqZ7K2Sq7WPTiZN_dJBJZm4YaH2nvGCQNkk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);