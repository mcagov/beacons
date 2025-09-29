export function toIsoDateString(year: string, month: string): string {
  const monthAsNumber = Number(month);
  const yearAsNumber = Number(year);
  const isValidMonth = monthAsNumber > 0 && monthAsNumber < 13;

  if (yearAsNumber && isValidMonth) {
    try {
      const isoDateStringCharLength = 10;
      return new Date(Date.UTC(yearAsNumber, monthAsNumber - 1))
        .toISOString()
        .slice(0, isoDateStringCharLength);
    } catch {
      return null;
    }
  }

  return null;
}

export const isoDate = (isoDateTime: string): string =>
  isoDateTime.slice(0, 10);

export const ONE_MONTH_SECONDS = 30 * 24 * 60 * 60;
