export function isoDateString(year: string, month: string): string {
  const monthAsNumber = Number(month);
  const yearAsNumber = Number(year);
  const isValidMonth = monthAsNumber > 0 && monthAsNumber < 13;

  if (yearAsNumber && isValidMonth) {
    try {
      const isoDateStringCharLength = 10;
      return new Date(yearAsNumber, monthAsNumber - 1)
        .toISOString()
        .slice(0, isoDateStringCharLength);
    } catch {
      return null;
    }
  }

  return null;
}
