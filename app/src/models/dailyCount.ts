export type DailyCount = {
  uuid: string
  organizationUuid: string
  // Supabase returns these as strings
  date: string
  picker: string
  count: number
  isPending: boolean
  messageUuid: string | null

  [key: string]: any
}

export const countOptions = Array.from({ length: 25 }, (_, i) => i + 1)