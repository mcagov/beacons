export const searchUrl = (hostname: string): string =>
  hostname == "localhost"
    ? "http://localhost:8081/search"
    : `https://search.${hostname}/search`;
