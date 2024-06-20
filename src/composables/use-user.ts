// composable to handle user data
import { ref } from "vue";
import { supabase } from "../supabase";

export const user = ref();
export const activity = ref<any>([]);

supabase.auth.onAuthStateChange(async (event, session) => {
  if (import.meta.env.DEV) {
    console.log("event", event, "session", session);
  }

  if (
    event === "SIGNED_IN" ||
    event === "TOKEN_REFRESHED" ||
    event === "INITIAL_SESSION"
  ) {
    user.value = session?.user;
  } else if (event === "SIGNED_OUT") {
    user.value = undefined;
  }
});

const useUser = () => {
  const updateUserPassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (!error) {
    }

    if (error) {
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
    }
  };

  return { getUserActivity, updateUserPassword };
};

export default useUser;
