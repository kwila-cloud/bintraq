import { supabase } from '@/lib/supabaseClient'
import type { Picker } from '@/models/picker'

// First number is year
// Second number is month
// Third number is day
// Fourth number is release index for that day (starts at 0)
export const appVersion = "2025.07.31.3";

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
  if (includeDeleted) {
    const { data: pickers } = await supabase.from('picker').select()
    return pickers ?? []
  } else {
    const { data: pickers } = await supabase.from('picker').select().eq('isDeleted', false)
    return pickers ?? []
  }
}

export const savePickers = async (pickers: Picker[]) => {
  const pickerNames = pickers.map((picker) => picker.name)
  const uniquePickerNames = new Set(pickerNames)
  if (pickerNames.length !== uniquePickerNames.size) {
    throw new Error('Picker names must be unique.')
  }

  // normalize the order values
  pickers.sort((a, b) => a.order - b.order)
  const pickersWithOrder = pickers.map((picker, index) => ({
    ...picker,
    order: index,
  }))
  const { error } = await supabase.from('picker').upsert(pickersWithOrder)
  if (error) {
    throw error
  }
}
