import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
    if(!supabase) {
        const url = process.env.SUPABASE_URL
        const key = process.env.SUPABASE_KEY

        if(!url || !key) {
            throw new Error(" Missing SUPABASE_URL or SUPABASE_KEY in environment variables")
        }

        supabase = createClient(url, key)
    }

    return supabase
}