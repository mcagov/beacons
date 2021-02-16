module.exports = {
  serverRuntimeConfig: {
    apiUrl: process.env.API_URL,
  },
  poweredByHeader: false,
  generateBuildId: async () => {
    return process.env.GIT_HASH;
  },
};
