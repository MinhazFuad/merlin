import { createClient } from '@/lib/supabase/server'
import { EditorClient } from '@/components/editor/EditorClient'

export default async function EditorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <EditorClient user={user} />
}
