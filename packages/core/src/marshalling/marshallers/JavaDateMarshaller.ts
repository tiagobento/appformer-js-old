import { NullableMarshaller } from "./NullableMarshaller";
import { JavaDate } from "../../java-wrappers/JavaDate";
import { ErraiObject } from "../model/ErraiObject";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { isString } from "../../util/TypeUtils";
import { ValueBasedErraiObject } from "../model/ValueBasedErraiObject";
import { NumberUtils } from "../../util/NumberUtils";

export class JavaDateMarshaller extends NullableMarshaller<JavaDate, ErraiObject, ErraiObject, Date> {
  public notNullMarshall(input: JavaDate, ctx: MarshallingContext): ErraiObject {
    return new ValueBasedErraiObject((input as any)._fqcn, `${input.get().getTime()}`).asErraiObject();
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): Date {
    const valueFromJson = ValueBasedErraiObject.from(input).value;
    if (!JavaDateMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid date value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    const asNumber = Number.parseInt(valueFromJson, 10);
    return new Date(asNumber);
  }

  private static isValid(input: any) {
    if (!input) {
      return false;
    }

    if (!isString(input)) {
      return false;
    }

    return NumberUtils.isNonNegativeIntegerString(input);
  }
}
