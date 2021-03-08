/**
 * A class that parses information from a given 406Mhz beacon hex id.
 *
 * The 15-digit hex code contains information represented as a string of 15
 * characters translating to a sequence of bits.  For example: ADCD0228C500401
 * represents the bit sequence: 1010 1101 1100 1101 0000 0010 0010 1000 1100
 * 0101 0000 0000 0100 0000 0001.
 *
 * The fields we care about are:
 *
 * # Country code:
 */
export class HexIdParser {
  public static countryCode(hexId: string): number {
    const [countryStartBit, countryEndBit] = [27, 36];
    return this.toDecimal(
      this.sliceBits(hexId, countryStartBit, countryEndBit).join("")
    );
  }

  private static toBits(hexId: string): string[] {
    return parseInt(hexId, 16).toString(2).padStart(60, "0").split("");
  }

  private static toDecimal(binaryString: string): number {
    return parseInt(binaryString, 2);
  }

  /**
   * Cospas-Sarsat documentation refers to the hexId's bits by their place in
   * the message sent from beacons to the satellite system.
   *
   * See
   * http://www.cospas-sarsat.int/images/stories/SystemDocs/Current/cs_g005_oct_2013.pdf
   * section 3.2.3.4
   *
   * For convenience, this constant allows HexIdParser to mirror the language
   * used in the Cospas-Sarsat documentation when referring to fields in the
   * Hex ID.  For example, the Cospas-Sarsat documentation refers to the country
   * code as existing in bits 27 to 36 of the *message*, which equate to bits 2
   * to 11 in the hexId.  HexIdParser is consistent with the C-S documentation.
   */
  private static sliceBits(
    hexId: string,
    start: number,
    finish: number
  ): string[] {
    const hexIdStartBit = 26;
    return this.toBits(hexId).slice(
      start - hexIdStartBit,
      finish - hexIdStartBit + 1
    );
  }
}
