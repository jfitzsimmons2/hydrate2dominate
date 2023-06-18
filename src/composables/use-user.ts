// composable to handle user data
import { ref } from "vue";
import { supabase } from "../supabase";
import { useToast } from "primevue/usetoast";

export const user = ref();
const useUser = () => {
  const toast = useToast();
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      user.value = session?.user;
    } else if (event === "SIGNED_OUT") {
      user.value = undefined;
    }
  });

  const updateUserPassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });

    if (!error) {
      toast.add({
        severity: "success",
        summary: "Password updated",
        detail: "Your password has been updated",
        life: 5000,
        group: "tr",
      });
    }

    if (error) {
      toast.add({
        severity: "error",
        summary: "Error updating password",
        detail: error.message,
        life: 0,
        group: "tr",
      });
      throw new Error(error.message);
    }
    return data;
  };

  const getUserActivity = async () => {
    const { data, error } = await supabase.rpc("get_user_activity");

    if (data) {
      return data;
    }

    if (error) {
      toast.add({
        severity: "error",
        summary: "Error getting activity",
        detail: error.message,
        life: 0,
        group: "tr",
      });
    }
  };

  return { user, getUserActivity, updateUserPassword };
};

export default useUser;
