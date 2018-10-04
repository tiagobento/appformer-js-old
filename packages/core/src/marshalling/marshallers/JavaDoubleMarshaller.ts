import { NullableMarshaller } from "./NullableMarshaller";
import { JavaDouble } from "../../java-wrappers/JavaDouble";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ErraiObject } from "../model/ErraiObject";
import { instanceOfNumber } from "../../util/TypeUtils";
import { NumValBasedErraiObject } from "../model/NumValBasedErraiObject";

export class JavaDoubleMarshaller extends NullableMarshaller<JavaDouble, number, ErraiObject | number, JavaDouble> {
  public notNullMarshall(input: JavaDouble, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaDouble {
    if (instanceOfNumber(input)) {
      return new JavaDouble(`${input}`);
    }

    const valueFromJson = NumValBasedErraiObject.from(input).numVal;
    if (!JavaDoubleMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid double value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaDouble(`${valueFromJson}`);
  }

  private static isValid(valueFromJson: any): boolean {
    if (valueFromJson === null || valueFromJson === undefined) {
      return false;
    }

    return instanceOfNumber(valueFromJson);
  }
}
