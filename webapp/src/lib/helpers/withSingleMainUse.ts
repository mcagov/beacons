export const withSingleMainUse = <T extends { mainUse?: boolean }>(
  uses: T[],
): T[] => {
  const firstMainUseIndex = uses.findIndex((use) => use.mainUse);
  const mainUseIndex = firstMainUseIndex === -1 ? 0 : firstMainUseIndex;

  return uses.map((use, index) => ({
    ...use,
    mainUse: index === mainUseIndex,
  }));
};
