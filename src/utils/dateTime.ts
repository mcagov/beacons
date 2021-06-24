export const isoDate = (isoDateTime: string): string =>
  isoDateTime.slice(0, 10);
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
