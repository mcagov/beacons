// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

process.env.AAD_CLIENT_ID = "test_client_id";
process.env.AAD_CLIENT_SECRET = "test_client_secret";
process.env.AAD_TENANT_ID = "test_tenant_id";
process.env.AAD_API_ID = "test_api_id";
process.env.API_URL = "http://localhost:8080/spring-api";
