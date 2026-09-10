/**
 * Local development sign-in. Reads secrets from the environment, so these helpers must only be
 * called server-side; pass isLocalAuthEnabled() to components as a prop.
 */

export const localAuthProviderId = "local";

export interface LocalUser {
  id: string;
  email: string;
  name: string;
}

export const isLocalAuthEnabled = (): boolean =>
  process.env.BEACONS_LOCAL_AUTH === "true";

export const localUser = (): LocalUser => ({
  // Becomes the account holder's authId, which the service parses as a UUID
  id: process.env.LOCAL_AUTH_ID || "00000000-0000-4000-8000-000000000001",
  email: process.env.LOCAL_AUTH_EMAIL || "dev@beacons.local",
  name: process.env.LOCAL_AUTH_NAME || "Dev User",
});

export const localCredentialsAreValid = (
  email: string,
  password: string,
): boolean => {
  const expectedPassword = process.env.LOCAL_AUTH_PASSWORD || "password";

  return email === localUser().email && password === expectedPassword;
};
