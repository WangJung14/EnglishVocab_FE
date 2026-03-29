export const saveTokens = (accessToken: string, refreshToken: string) => {
  // Local storage để Client-side sử dụng
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  // Cookie để Next.js Server Components (SSR/RSC) đọc được
  document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
}

export const clearTokens = () => {
  // Xóa Local Storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Xóa Cookie
  document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("accessToken");
  }
  return null;
}

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("refreshToken");
  }
  return null;
}

export const isLoggedIn = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem("accessToken");
  }
  return false;
}
