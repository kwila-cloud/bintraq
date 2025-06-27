import { supabase } from "@/lib/supabaseClient";

export const getUserProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: [userProfile],
  } = await supabase.from("userProfile").select().eq("id", user.id);
  return userProfile;
};

export const getOrganization = async () => {
  const userProfile = await getUserProfile();
  const {
    data: [organization],
  } = await supabase
    .from("organization")
    .select()
    .eq("uuid", userProfile.organizationUuid);
  return organization;
};

export const getPickers = async () => {
  const {
    data: pickers
  } = await supabase
    .from("picker")
    .select();
  return pickers;
};
