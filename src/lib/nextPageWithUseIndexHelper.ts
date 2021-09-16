import { queryParams } from "./urls";

export const nextPageWithUseId = (useId: number, url: string): string => {
  return url + queryParams({ useId });
};
