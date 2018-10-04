import { NullableMarshaller } from "./NullableMarshaller";
import { JavaBigInteger } from "../../java-wrappers/JavaBigInteger";
import { ErraiObject } from "../model/ErraiObject";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ValueBasedErraiObject } from "../model/ValueBasedErraiObject";
import { NumberUtils } from "../../util/NumberUtils";
import { isString } from "../../util/TypeUtils";

export class JavaBigIntegerMarshaller extends NullableMarshaller<
  JavaBigInteger,
  ErraiObject,
  ErraiObject,
  JavaBigInteger
> {
  public notNullMarshall(input: JavaBigInteger, ctx: MarshallingContext): ErraiObject {
    const fqcn = (input as any)._fqcn;
    const value = input.get().toString(10);
    const objectId = ctx.incrementAndGetObjectId().toString(10);
    return new ValueBasedErraiObject(fqcn, value, objectId).asErraiObject();
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): JavaBigInteger {
    const valueFromJson = ValueBasedErraiObject.from(input).value as string;

    if (!JavaBigIntegerMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid BigInteger value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaBigInteger(valueFromJson);
  }

  private static isValid(valueFromJson: string): boolean {
    if (!isString(valueFromJson)) {
      return false;
    }

    if (!valueFromJson) {
      return false;
    }

    return NumberUtils.isIntegerString(valueFromJson);
  }
}
