export function getUserRole() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || "Employee";
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
