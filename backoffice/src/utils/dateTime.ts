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

  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return dateTimeString;
    return date.toLocaleDateString("en-GB");
  } catch (err) {
    return dateTimeString;
  }
};
