import { supabase } from '@/lib/supabaseClient'
import type { Picker } from '@/models/picker'

export const getUserProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user == null) {
    console.error('No user is signed in!')
    return
  }
  const { data } = await supabase.from('userProfile').select().eq('id', user.id)
  if (data) {
    return data[0]
  }
  console.error('No user profile found!')
  return
}

export const getOrganization = async () => {
  const userProfile = await getUserProfile()
  const { data } = await supabase
    .from('organization')
    .select()
    .eq('uuid', userProfile.organizationUuid)
  if (data) {
    return data[0]
  }
  console.error('No organization found!')
  return
}

export const getPickers = async (): Promise<Picker[]> => {
  const { data: pickers } = await supabase.from('picker').select()
  return pickers ?? []
}

export const savePickers = async (pickers: Picker[]) => {
  // AI!: save pickers to supabase
}
