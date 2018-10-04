import { NullableMarshaller } from "./NullableMarshaller";
import { JavaFloat } from "../../java-wrappers/JavaFloat";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { instanceOfNumber } from "../../util/TypeUtils";
import { ErraiObject } from "../model/ErraiObject";
import { NumValBasedErraiObject } from "../model/NumValBasedErraiObject";

export class JavaFloatMarshaller extends NullableMarshaller<JavaFloat, number, ErraiObject | number, JavaFloat> {
  public notNullMarshall(input: JavaFloat, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaFloat {
    if (instanceOfNumber(input)) {
      return new JavaFloat(`${input}`);
    }

    const valueFromJson = NumValBasedErraiObject.from(input).numVal;
    if (!JavaFloatMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid float value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaFloat(`${valueFromJson}`);
  }

  private static isValid(valueFromJson: any): boolean {
    if (valueFromJson === null || valueFromJson === undefined) {
      return false;
    }

    return instanceOfNumber(valueFromJson);
  }
}
