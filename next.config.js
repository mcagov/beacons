// See: https://nextjs.org/docs/api-reference/next.config.js/introduction
module.exports = {
  serverRuntimeConfig: {
    apiUrl: process.env.API_URL,
  },
  poweredByHeader: false,
  generateBuildId: async () => {
    return process.env.GIT_HASH;
  },
};
