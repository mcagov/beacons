import { render, waitFor } from "@testing-library/react";
import React from "react";
import { AuthState, useGetAuthState } from "./useGetAuthState";

let observed: AuthState;

const AuthStateProbe = (): JSX.Element => {
  observed = useGetAuthState();
  return <span>{observed.status}</span>;
};

describe("useGetAuthState", () => {
  it("signs in the local development user when the stub server reports local auth", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        mode: "local",
        username: "dev@beacons.local",
        displayName: "Dev User",
        roles: ["UPDATE_RECORDS", "ADMIN_EXPORT"],
      }),
    }) as any;

    render(<AuthStateProbe />);

    await waitFor(() => expect(observed.status).toEqual("LOCAL"));
    expect(observed).toEqual({
      status: "LOCAL",
      config: {
        username: "dev@beacons.local",
        displayName: "Dev User",
        roles: ["UPDATE_RECORDS", "ADMIN_EXPORT"],
      },
    });
  });

  it("falls back to Azure AD when the auth mode endpoint is absent", async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url === "/backoffice/auth-mode")
        return Promise.resolve({ ok: false, json: async () => ({}) });
      if (url === "/backoffice/tenant-id")
        return Promise.resolve({ text: async () => "a-tenant-id" });
      return Promise.resolve({ text: async () => "a-client-id" });
    }) as any;

    render(<AuthStateProbe />);

    await waitFor(() => expect(observed.status).toEqual("OK"));
    expect(observed).toEqual({
      status: "OK",
      config: {
        auth: {
          clientId: "a-client-id",
          authority: "https://login.microsoftonline.com/a-tenant-id",
        },
        cache: { cacheLocation: "localStorage" },
      },
    });
  });

  it("falls back to Azure AD when the stub server reports azure auth", async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url === "/backoffice/auth-mode")
        return Promise.resolve({
          ok: true,
          json: async () => ({ mode: "azure" }),
        });
      if (url === "/backoffice/tenant-id")
        return Promise.resolve({ text: async () => "a-tenant-id" });
      return Promise.resolve({ text: async () => "a-client-id" });
    }) as any;

    render(<AuthStateProbe />);

    await waitFor(() => expect(observed.status).toEqual("OK"));
  });
});
