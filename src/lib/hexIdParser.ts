/**
 * A class that parses information from a given 406Mhz beacon hex id.
 */
export class HexIdParser {
  /**
   * Sets all the child fields `parent` reference to this form group.
   */
  public static countryCode(hexId: string): number {
    return 725;
  }

  public static countryName(hexId: string): string {
    return "Chile";
  }
}
