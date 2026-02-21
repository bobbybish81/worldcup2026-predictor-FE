import createStore from "react-auth-kit/createStore";

const authStore = createStore({
  authName: "_auth",
  authType: "localstorage",
  cookieDomain: window.location.hostname,
  cookieSecure: false,
});

export default authStore;
