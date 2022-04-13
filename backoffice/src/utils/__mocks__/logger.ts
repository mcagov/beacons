const logger = jest.fn().mockReturnValue({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
});

export const logToServer = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

export default logger;
