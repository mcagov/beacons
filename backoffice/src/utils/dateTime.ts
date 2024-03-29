import moment from "moment";

export const isoDate = (isoDateTime: string) => isoDateTime.slice(0, 10);
export const formatDateLong = (dateString: string): string => {
  const date = new Date(dateString);
  const [, month, day, year] = date.toDateString().split(" ");
  return `${parseInt(day)} ${month} ${year.slice(2)}`;
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

export const customDateStringFormat = (
  dateTimeString: string | Date | undefined,
  format: string
): string => {
  var date = moment(dateTimeString, format);

  if (!date.isValid()) {
    date = moment(dateTimeString);
  }

  if (!date.isValid()) {
    return typeof dateTimeString === "string" ? dateTimeString : "";
  }

  return date.format(format);
};
