export const reauth = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};
