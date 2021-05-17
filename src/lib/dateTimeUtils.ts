export function getISODate(year: string, month: string): string {
  const monthAsNumber = Number(month);
  const yearAsNumber = Number(year);
  const isValidMonth = monthAsNumber > 0 && monthAsNumber < 13;

  if (yearAsNumber && isValidMonth) {
    try {
      return new Date(yearAsNumber, monthAsNumber - 1).toISOString();
    } catch {
      return null;
    }
  }

  return null;
}
