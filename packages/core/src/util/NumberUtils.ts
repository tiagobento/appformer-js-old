export class NumberUtils {
  public static readonly nonNegativeIntegerRegex = new RegExp(/^\d*$/);
  public static readonly integerNumberRegex = new RegExp(/^(-)?\d*$/);
  public static readonly floatNumberRegex = new RegExp(/^(-)?(\d*)(\.)?(\d*)$/);

  public static isNonNegativeIntegerString(str: string): boolean {
    return this.nonNegativeIntegerRegex.test(str);
  }

  public static isIntegerString(str: string): boolean {
    return this.integerNumberRegex.test(str);
  }

  public static isFloatString(str: string): boolean {
    return this.floatNumberRegex.test(str);
  }
}
