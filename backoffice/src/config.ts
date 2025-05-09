import { serviceUrl } from "./utils/urls";

export const applicationConfig = {
  apiUrl: serviceUrl(window.location.hostname),
  apiTimeoutMs: 120000,
};
