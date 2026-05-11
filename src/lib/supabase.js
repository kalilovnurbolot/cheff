import { createClient } from '@supabase/supabase-js'

const URL  = import.meta.env.VITE_SUPABASE_URL
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!URL || !ANON) {
  console.warn('[Cheff] Supabase не настроен. Добавь VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env')
}

export const supabase = createClient(URL || 'https://placeholder.supabase.co', ANON || 'placeholder', {
  auth: { persistSession: false },
})

export const isConfigured = !!(URL && ANON && URL !== 'https://placeholder.supabase.co')
