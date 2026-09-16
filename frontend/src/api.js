export const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL ?? "";
console.log("BASE_URL", BASE_URL);

export const mediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
