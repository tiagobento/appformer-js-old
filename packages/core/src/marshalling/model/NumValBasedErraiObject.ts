import { ErraiObject } from "./ErraiObject";
import { ErraiObjectConstants } from "./ErraiObjectConstants";

export class NumValBasedErraiObject {
  public readonly encodedType: string;
  public readonly objId: string;
  public readonly numVal: number | boolean | string;

  constructor(encodedType: string, numVal: number | boolean | string, objectId: string = "-1") {
    this.encodedType = encodedType;
    this.numVal = numVal;
    this.objId = objectId;
  }

  public asErraiObject(): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: this.encodedType,
      [ErraiObjectConstants.OBJECT_ID]: this.objId,
      [ErraiObjectConstants.NUM_VAL]: this.numVal
    };
  }

  public static from(obj: ErraiObject): NumValBasedErraiObject {
    return new NumValBasedErraiObject(
      obj[ErraiObjectConstants.ENCODED_TYPE],
      obj[ErraiObjectConstants.NUM_VAL]!,
      obj[ErraiObjectConstants.OBJECT_ID]
    );
  }
}
