export function useRankString(number: number): string {
  const map = {
    1: "main",
    2: "second",
    3: "third",
    4: "fourth",
    5: "fifth",
  };

  return map[number];
}
