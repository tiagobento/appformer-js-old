import { NullableMarshaller } from "./NullableMarshaller";
import { JavaBigDecimal } from "../../java-wrappers/JavaBigDecimal";
import { ErraiObject } from "../model/ErraiObject";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ValueBasedErraiObject } from "../model/ValueBasedErraiObject";
import { NumberUtils } from "../../util/NumberUtils";
import { isString } from "../../util/TypeUtils";

export class JavaBigDecimalMarshaller extends NullableMarshaller<
  JavaBigDecimal,
  ErraiObject,
  ErraiObject,
  JavaBigDecimal
> {
  public notNullMarshall(input: JavaBigDecimal, ctx: MarshallingContext): ErraiObject {
    const fqcn = (input as any)._fqcn;
    const value = input.get().toString(10);
    const objectId = ctx.incrementAndGetObjectId().toString(10);
    return new ValueBasedErraiObject(fqcn, value, objectId).asErraiObject();
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): JavaBigDecimal {
    const valueFromJson = ValueBasedErraiObject.from(input).value as string;

    if (!JavaBigDecimalMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid BigDecimal value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaBigDecimal(valueFromJson);
  }

  private static isValid(valueFromJson: string): boolean {
    if (!valueFromJson) {
      return false;
    }

    if (!isString(valueFromJson)) {
      return false;
    }

    return NumberUtils.isFloatString(valueFromJson);
  }
}
