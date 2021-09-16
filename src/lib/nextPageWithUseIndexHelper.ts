import { queryParams } from "./urls";

export const nextPageWithUseIndexHelper = (
  useId: number,
  url: string
): string => {
  return url + queryParams({ useId });
};
