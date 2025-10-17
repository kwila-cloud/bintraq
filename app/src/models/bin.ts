export type Bin = {
  uuid: string
  organizationUuid: string
  // Supabase returns these as strings
  date: string
  picker: string
  block: string
  size: string
  id: string
  isPending: boolean
  messageUuid: string | null

  [key: string]: string | number | boolean | null
}

export const blockOptions = [
  '1',
  '2A',
  '2B',
  '2C',
  '3A',
  '3B',
  '4A',
  '4B',
  '4C',
  '5',
  '6',
  '7A',
  '7D',
  '10A',
  '10B',
  '11',
  '12',
  '13B',
  '13C',
  '14',
]

export const sizeOptions = [18, 20, 21, 23, 25]
