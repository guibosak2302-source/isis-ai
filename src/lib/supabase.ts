import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://whjdjbxoxuoudjtuapqs.supabase.co',
    'sb_publishable_66ZJXoQkHIidA5n65NjnMg_XintUyRs'
  )
}
