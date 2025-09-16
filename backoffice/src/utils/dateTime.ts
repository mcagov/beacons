export const isoDate = (isoDateTime: string) => isoDateTime.slice(0, 10);

export const formatDateLong = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatMonth = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

export const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return "";

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateTimeString)) return dateTimeString;

  if (/^\d{4}-\d{2}$/.test(dateTimeString)) {
    const [year, month] = dateTimeString.split("-");
    return `${month}/${year}`;
  }

  try {
    const date = new Date(dateTimeString);
    return isNaN(date.getTime())
      ? dateTimeString
      : date.toLocaleDateString("en-GB");
  } catch (err) {
    return dateTimeString;
  }
};

export const convertToISODateTime = (dateTimeString: string): string => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateTimeString)) return dateTimeString;

  try {
    const [day, month, year] = dateTimeString.split("/").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return isNaN(date.getTime()) ? dateTimeString : date.toISOString();
  } catch (err) {
    return dateTimeString;
  }
};
