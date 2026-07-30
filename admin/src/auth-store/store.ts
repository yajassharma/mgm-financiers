import createAuthStore from "react-auth-kit/store/createAuthStore";

export const authStore = createAuthStore("localstorage", {
  authName: import.meta.env.VITE_APP_AUTH_NAME || "mgm_admin_auth",
});
