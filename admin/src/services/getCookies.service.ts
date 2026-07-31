export const getCookie = (name: string) => {
  let cookieValue = "";
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (const element of cookies) {
      const cookie = element.trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

export const deleteAllCookies = () => {
  const authKeys = ['token', 'mgm_admin_auth'];
  authKeys.forEach((key) => {
    document.cookie = `${key}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/`;
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
  });
};
