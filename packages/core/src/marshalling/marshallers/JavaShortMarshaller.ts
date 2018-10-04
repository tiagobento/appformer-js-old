import { JavaShort } from "../../java-wrappers/JavaShort";
import { MarshallingContext } from "../MarshallingContext";
import { NullableMarshaller } from "./NullableMarshaller";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { instanceOfNumber } from "../../util/TypeUtils";
import { ErraiObject } from "../model/ErraiObject";
import { NumValBasedErraiObject } from "../model/NumValBasedErraiObject";
import { NumberUtils } from "../../util/NumberUtils";

export class JavaShortMarshaller extends NullableMarshaller<JavaShort, number, ErraiObject | number, JavaShort> {
  public notNullMarshall(input: JavaShort, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaShort {
    const valueFromJson = instanceOfNumber(input) ? input : NumValBasedErraiObject.from(input).numVal;
    if (!JavaShortMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid short value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaShort(`${valueFromJson}`);
  }

  private static isValid(valueFromJson: any): boolean {
    if (valueFromJson === null || valueFromJson === undefined) {
      return false;
    }

    if (!instanceOfNumber(valueFromJson)) {
      return false;
    }

    return NumberUtils.isIntegerString(`${valueFromJson}`);
  }
}
