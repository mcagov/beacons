export type DeleteCachedUseFn = (
  submissionId: string,
  useIndex: number
) => Promise<void>;
