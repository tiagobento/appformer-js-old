import { NullableMarshaller } from "./NullableMarshaller";
import { JavaBoolean } from "../../java-wrappers/JavaBoolean";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ErraiObject } from "../model/ErraiObject";
import { instanceOfBoolean } from "../../util/TypeUtils";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";

export class JavaBooleanMarshaller extends NullableMarshaller<JavaBoolean, boolean, ErraiObject | boolean, boolean> {
  public notNullMarshall(input: JavaBoolean, ctx: MarshallingContext): boolean {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | boolean, ctx: UnmarshallingContext): boolean {
    if (instanceOfBoolean(input)) {
      return input;
    }

    return JavaBooleanMarshaller.fromErraiObject(input);
  }

  private static fromErraiObject(input: ErraiObject) {
    const valueFromJson = input[ErraiObjectConstants.NUM_VAL];
    if (!instanceOfBoolean(valueFromJson)) {
      throw new Error(`Invalid boolean value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return valueFromJson;
  }
}
