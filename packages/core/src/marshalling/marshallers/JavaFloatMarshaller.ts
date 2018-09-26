import { NullableMarshaller } from "./NullableMarshaller";
import { JavaFloat } from "../../java-wrappers/JavaFloat";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { instanceOfNumber } from "../../util/TypeUtils";
import { ErraiObject } from "../model/ErraiObject";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";

export class JavaFloatMarshaller extends NullableMarshaller<JavaFloat, number, ErraiObject | number, JavaFloat> {
  public notNullMarshall(input: JavaFloat, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaFloat {
    if (instanceOfNumber(input)) {
      return new JavaFloat(input.toString(10));
    }

    return JavaFloatMarshaller.fromErraiObject(input);
  }

  private static fromErraiObject(input: ErraiObject) {
    const valueFromJson = input[ErraiObjectConstants.NUM_VAL];
    if (!instanceOfNumber(valueFromJson)) {
      throw new Error(`Invalid float value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaFloat(valueFromJson.toString(10));
  }
}
