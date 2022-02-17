import { queryParams } from "./urls";

export const nextPageWithUseIdHelper = (useId: number, url: string): string => {
  return url + queryParams({ useId });
};
