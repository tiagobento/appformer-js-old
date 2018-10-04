import { ErraiObject } from "./ErraiObject";
import { ErraiObjectConstants } from "./ErraiObjectConstants";

export class ValueBasedErraiObject {
  public readonly encodedType: string;
  public readonly objId: string;
  public readonly value: any;

  constructor(encodedType: string, value: any, objectId: string = "-1") {
    this.encodedType = encodedType;
    this.value = value;
    this.objId = objectId;
  }

  public asErraiObject(): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: this.encodedType,
      [ErraiObjectConstants.OBJECT_ID]: this.objId,
      [ErraiObjectConstants.VALUE]: this.value
    };
  }

  public static from(obj: ErraiObject): ValueBasedErraiObject {
    return new ValueBasedErraiObject(
      obj[ErraiObjectConstants.ENCODED_TYPE],
      obj[ErraiObjectConstants.VALUE],
      obj[ErraiObjectConstants.OBJECT_ID]
    );
  }
}
