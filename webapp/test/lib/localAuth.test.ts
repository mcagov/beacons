import {
  isLocalAuthEnabled,
  localCredentialsAreValid,
  localUser,
} from "../../src/lib/localAuth";

describe("localAuth", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("isLocalAuthEnabled", () => {
    it("is off unless BEACONS_LOCAL_AUTH is exactly 'true'", () => {
      delete process.env.BEACONS_LOCAL_AUTH;
      expect(isLocalAuthEnabled()).toBe(false);

      process.env.BEACONS_LOCAL_AUTH = "false";
      expect(isLocalAuthEnabled()).toBe(false);

      process.env.BEACONS_LOCAL_AUTH = "TRUE";
      expect(isLocalAuthEnabled()).toBe(false);
    });

    it("is on when BEACONS_LOCAL_AUTH is 'true'", () => {
      process.env.BEACONS_LOCAL_AUTH = "true";
      expect(isLocalAuthEnabled()).toBe(true);
    });
  });

  describe("localUser", () => {
    it("takes its identity from the environment", () => {
      process.env.LOCAL_AUTH_ID = "11111111-1111-4111-8111-111111111111";
      process.env.LOCAL_AUTH_EMAIL = "someone@example.com";
      process.env.LOCAL_AUTH_NAME = "Someone Else";

      expect(localUser()).toEqual({
        id: "11111111-1111-4111-8111-111111111111",
        email: "someone@example.com",
        name: "Someone Else",
      });
    });

    it("falls back to defaults when the environment is unset", () => {
      delete process.env.LOCAL_AUTH_ID;
      delete process.env.LOCAL_AUTH_EMAIL;
      delete process.env.LOCAL_AUTH_NAME;

      expect(localUser()).toEqual({
        id: "00000000-0000-4000-8000-000000000001",
        email: "dev@beacons.local",
        name: "Dev User",
      });
    });
  });

  describe("localCredentialsAreValid", () => {
    beforeEach(() => {
      process.env.LOCAL_AUTH_EMAIL = "dev@beacons.local";
      process.env.LOCAL_AUTH_PASSWORD = "a-password";
    });

    it("accepts the configured email and password", () => {
      expect(localCredentialsAreValid("dev@beacons.local", "a-password")).toBe(
        true,
      );
    });

    it("rejects a wrong password", () => {
      expect(localCredentialsAreValid("dev@beacons.local", "nope")).toBe(false);
    });

    it("rejects an unknown email", () => {
      expect(localCredentialsAreValid("someone@else.com", "a-password")).toBe(
        false,
      );
    });
  });
});
