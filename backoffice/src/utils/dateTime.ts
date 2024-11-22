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
  return dateTimeString
    ? new Date(dateTimeString).toLocaleDateString("en-GB", {})
    : "";
};
