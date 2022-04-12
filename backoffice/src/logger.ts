import winston from "winston";

export const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { origin: "BACKOFFICE_CLIENT" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.Http({
      host: "/backoffice/log",
    }),
  ],
});
