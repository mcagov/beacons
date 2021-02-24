import { IFormCache } from "../src/lib/formCache";

export const getCacheMock = (): jest.Mocked<IFormCache> => {
  return { get: jest.fn(), update: jest.fn() };
};
