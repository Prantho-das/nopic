
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

/**
 * PROJECT CREDENTIALS
 * URL: https://yuqqbzusmadqkuanmqyl.supabase.co
 * KEY: sb_publishable_kSMohxVgdzWhPZ81bjr9Dw_AqCjeQTj
 */

const supabaseUrl = 'https://yuqqbzusmadqkuanmqyl.supabase.co';
const supabaseAnonKey = 'sb_publishable_kSMohxVgdzWhPZ81bjr9Dw_AqCjeQTj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
