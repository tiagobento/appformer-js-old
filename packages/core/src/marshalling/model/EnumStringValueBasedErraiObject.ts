import { ErraiObject } from "./ErraiObject";
import { ErraiObjectConstants } from "./ErraiObjectConstants";

export class EnumStringValueBasedErraiObject {
  public readonly encodedType: string;
  public readonly enumValueName: string;

  constructor(encodedType: string, enumValueName: string) {
    this.encodedType = encodedType;
    this.enumValueName = enumValueName;
  }

  public asErraiObject(): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: this.encodedType,
      [ErraiObjectConstants.ENUM_STRING_VALUE]: this.enumValueName
    };
  }

  public static from(obj: ErraiObject): EnumStringValueBasedErraiObject {
    return new EnumStringValueBasedErraiObject(
      obj[ErraiObjectConstants.ENCODED_TYPE],
      obj[ErraiObjectConstants.ENUM_STRING_VALUE]!
    );
  }
}
