import { MarshallingContext } from "../MarshallingContext";
import { JavaInteger } from "../../java-wrappers/JavaInteger";
import { NullableMarshaller } from "./NullableMarshaller";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ErraiObject } from "../model/ErraiObject";
import { instanceOfNumber } from "../../util/TypeUtils";
import { NumValBasedErraiObject } from "../model/NumValBasedErraiObject";
import { NumberUtils } from "../../util/NumberUtils";

export class JavaIntegerMarshaller extends NullableMarshaller<JavaInteger, number, ErraiObject | number, JavaInteger> {
  public notNullMarshall(input: JavaInteger, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaInteger {
    const valueFromJson = instanceOfNumber(input) ? input : NumValBasedErraiObject.from(input).numVal;
    if (!JavaIntegerMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid integer value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaInteger(`${valueFromJson}`);
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
