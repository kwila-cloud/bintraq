export type Picker = {
	uuid: string
  organizationUuid: string
  order: number
  name: string
  phoneNumber: string
  // Supabase returns these as strings
  createdAt: string
  isDeleted: boolean
}
