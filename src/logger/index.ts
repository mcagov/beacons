import winston, { format } from "winston";

const { combine, timestamp, errors, json } = format;

const logger = winston.createLogger({
  // formatting the log
  format: combine(timestamp(), errors({ stack: true }), json()),
  // locations to log to
  transports: [new winston.transports.Console()],
});

export default logger;
