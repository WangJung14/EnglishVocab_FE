export const BASE_URL = "http://localhost:8080/api/v1";

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("accessToken");
  
  const headers = new Headers(options.headers);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (data.code !== 1000) {
    throw new Error(data.message || "Lỗi không xác định");
  }

  return data.result;
};
