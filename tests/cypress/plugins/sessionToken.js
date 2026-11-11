// eslint-disable-next-line @typescript-eslint/no-var-requires
const { hkdf, randomUUID } = require("crypto");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EncryptJWT } = require("jose");

const testUserEmail = "beacons_test_b2c@mailsac.com";

const maxAgeInSeconds = 24 * 60 * 60;

const deriveEncryptionKey = (secret) =>
  new Promise((resolve, reject) =>
    hkdf(
      "sha256",
      secret,
      "",
      "NextAuth.js Generated Encryption Key",
      32,
      (err, key) => (err ? reject(err) : resolve(new Uint8Array(key))),
    ),
  );

const mintSessionToken = async (secret, authId) => {
  if (!secret || !authId) {
    throw new Error(
      "JWT_SECRET and TEST_USER_AUTH_ID must be set to mint a session token",
    );
  }

  return new EncryptJWT({ sub: authId, email: testUserEmail, name: "" })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeInSeconds)
    .setJti(randomUUID())
    .encrypt(await deriveEncryptionKey(secret));
};

module.exports = { mintSessionToken };
