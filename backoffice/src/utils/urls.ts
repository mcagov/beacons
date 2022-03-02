export const searchUrl = (hostname: string): string =>
  hostname == "localhost"
    ? "http://localhost:8081/search/"
    : `https://search.${hostname}/search/`;

export const serviceUrl = (hostname: string): string =>
  hostname == "localhost"
    ? "http://localhost:8080/spring-api"
    : `https://${hostname}/spring-api`;
