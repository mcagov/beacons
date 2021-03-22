import midCodes from "./midCodes.json";

/**
 * Parses encoded information from a given 406Mhz beacon hex id.
 *
 * @remarks
 * The 15-digit hexId serves two functions:
 *
 *      1) uniquely identify a beacon
 *
 *      2) communicate information about the beacon, such as the country to
 *      which it is registered.
 *
 * To access the data, the hexId must be converted into binary and then sliced
 * according to the bit positions defined in C/S G.005 (see
 * http://www.cospas-sarsat.int/images/stories/SystemDocs/Current/cs_g005_oct_2013.pdf
 * section 3.2.3)
 *
 * For example, to get the country code from hexId ADCD0228C500401, you would:
 *
 * 1. Convert the hexId to binary:
 *
 *      ADCD0228C500401 in hexadecimal becomes ->
 *      101011011100110100000010001010001100010100000000010000000001
 *      in binary
 *
 * 2.  Extract the binary data fields by slicing based on position in the
 * 60-digit binary string:
 *
 *      P|Country ||   Other data depending on encoding protocol   |
 *      101011011100110100000010001010001100010100000000010000000001
 *
 *      (P = protocol flag)
 *
 * For all hexIds regardless of encoding protocol, the country code is at index
 * positions 1 to 11 (on a zero-based index).  The countryCode for the example
 * hexId is therefore:
 *
 *      Country code: 0101101110
 *
 * 4.  Convert the extracted field to decimal:
 *
 * Country code in decimal: 366
 *
 */
export class HexIdParser {
  /**
   * Parses the country code from a hexId.
   *
   * @remarks See worked example of extracting a country code from a hexId in
   * the top-level documentation for this class.  Cospas-Sarsat uses Maritime
   * Identification Digits (MIDs) from the ITU to represent countries in hexIds.
   *
   * See C/S G.005 and https://www.itu.int/en/ITU-R/terrestrial/fmd/Pages/mid.aspx.
   *
   * @param hexId - The hexId string
   * @returns The three-digit integer MID country code encoded in the hexId
   *
   */
  public static countryCode(hexId: string): number {
    const countryCodeBitRange = [1, 11];
    return this.binaryToDecimal(
      this.hexToBinary(hexId).slice(...countryCodeBitRange)
    );
  }

  public static countryName(hexId: string): string {
    return midCodes[this.countryCode(hexId).toString()][3];
  }

  private static hexToBinary(hexId: string): string {
    return parseInt(hexId, 16).toString(2).padStart(60, "0");
  }

  private static binaryToDecimal(binaryString: string): number {
    return parseInt(binaryString, 2);
  }
}
