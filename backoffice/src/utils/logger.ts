const logger = (callback: (log: string | unknown) => void) => {
  const allLogsPrefix = "BACKOFFICE_CLIENT";

  return {
    error: (message: string | unknown) => {
      console.error(message);
      callback(`${allLogsPrefix} [ERROR]: ${message}`);
    },
    warn: (message: string | unknown) => {
      console.warn(message);
      callback(`${allLogsPrefix} [WARN]: ${message}`);
    },
    info: (message: string | unknown) => {
      console.info(message);
      callback(`${allLogsPrefix} [INFO]: ${message}`);
    },
  };
};

const postToServer = (log: string | unknown): void => {
  const message = typeof log === "string" ? log : JSON.stringify(log);
  try {
    fetch("/backoffice/log", { method: "POST", body: message });
  } catch (e) {
    console.warn(`Failed to send log message to server: ${e}`);
  }
};

export const logToServer = logger(postToServer);

export default logger;
