import { NullableMarshaller } from "./NullableMarshaller";
import { JavaDouble } from "../../java-wrappers/JavaDouble";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ErraiObject } from "../model/ErraiObject";
import { instanceOfNumber } from "../../util/TypeUtils";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";

export class JavaDoubleMarshaller extends NullableMarshaller<JavaDouble, number, ErraiObject | number, JavaDouble> {
  public notNullMarshall(input: JavaDouble, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaDouble {
    if (instanceOfNumber(input)) {
      return new JavaDouble(input.toString(10));
    }

    return JavaDoubleMarshaller.fromErraiObject(input);
  }

  private static fromErraiObject(input: ErraiObject) {
    const valueFromJson = input[ErraiObjectConstants.NUM_VAL];
    if (!instanceOfNumber(valueFromJson)) {
      throw new Error(`Invalid double value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaDouble(valueFromJson.toString(10));
  }
}
