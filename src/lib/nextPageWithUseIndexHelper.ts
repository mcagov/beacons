import { queryParams } from "./urls";

export const nextPageWithUseIndex = (useIndex: number, url: string): string => {
  return url + queryParams({ useIndex });
};
