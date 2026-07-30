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

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/`;

  // Remove it from local storage too
  window.sessionStorage.removeItem(name);
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split("; ");

  cookies.forEach((cookie) => {
    const name = cookie.split("=").shift();
    deleteCookie(name ?? "");
  });

  // Some sites backup cookies in `localStorage`
  window.sessionStorage.clear();
  window.localStorage.clear();
};
