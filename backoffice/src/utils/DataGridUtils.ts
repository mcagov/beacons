export const dateSortComparator = (v1: string, v2: string) => {
  const date1 = new Date(v1.split("/").reverse().join("-"));
  const date2 = new Date(v2.split("/").reverse().join("-"));
  return date1.getTime() - date2.getTime();
};
