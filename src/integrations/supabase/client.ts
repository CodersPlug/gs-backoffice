// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bamdlnybhcqkiihpwdlz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbWRsbnliaGNxa2lpaHB3ZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MTQzOTgsImV4cCI6MjA1MDk5MDM5OH0.vk5qBRX0xiwFPxlDJXxdVONEAIhpo_kUlriHpQiii2c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);