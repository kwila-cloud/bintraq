import { supabase } from '@/lib/supabaseClient'
import type { Picker } from '@/models/picker'

// First number is year
// Second number is month
// Third number is day
// Fourth number is release index for that day (starts at 0)
export const appVersion = '2025.10.17.4'

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

export const getPickers = async (includeDeleted = false): Promise<Picker[]> => {
  let pickers = []
  if (includeDeleted) {
    const { data } = await supabase.from('picker').select()
    pickers = data ?? []
  } else {
    const { data } = await supabase.from('picker').select().eq('isDeleted', false)
    pickers = data ?? []
  }
  pickers.sort((a, b) => a.name.localeCompare(b.name))
  return pickers
}

export const isDailyCountUiEnabled = (): boolean => 
  localStorage.getItem('dailyCountUiEnabled') === 'true'

export const savePickers = async (pickers: Picker[]) => {
  const pickerNames = pickers.map((picker) => picker.name)
  const uniquePickerNames = new Set(pickerNames)
  if (pickerNames.length !== uniquePickerNames.size) {
    throw new Error('Picker names must be unique.')
  }

  const { error } = await supabase.from('picker').upsert(pickers)
  if (error) {
    throw error
  }
}
