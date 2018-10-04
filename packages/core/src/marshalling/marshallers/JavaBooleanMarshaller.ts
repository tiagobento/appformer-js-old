import { NullableMarshaller } from "./NullableMarshaller";
import { JavaBoolean } from "../../java-wrappers/JavaBoolean";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ErraiObject } from "../model/ErraiObject";
import { instanceOfBoolean } from "../../util/TypeUtils";
import { NumValBasedErraiObject } from "../model/NumValBasedErraiObject";

export class JavaBooleanMarshaller extends NullableMarshaller<JavaBoolean, boolean, ErraiObject | boolean, boolean> {
  public notNullMarshall(input: JavaBoolean, ctx: MarshallingContext): boolean {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | boolean, ctx: UnmarshallingContext): boolean {
    if (instanceOfBoolean(input)) {
      return input;
    }

    const valueFromJson = NumValBasedErraiObject.from(input).numVal;

    if (!JavaBooleanMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid boolean value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return valueFromJson as boolean;
  }

  private static isValid(valueFromJson: any): boolean {
    if (valueFromJson === null || valueFromJson === undefined) {
      return false;
    }

    return instanceOfBoolean(valueFromJson);
  }
}
