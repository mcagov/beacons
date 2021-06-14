module.exports = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/auth/:path*",
        headers: [
          {
            key: "access-control-allow-origin",
            value: "*",
          },
          {
            key: "access-control-allow-methods",
            value: "OPTIONS, GET",
          },
        ],
      },
    ];
  },
};
