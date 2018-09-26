import { MarshallingContext } from "../MarshallingContext";
import { JavaInteger } from "../../java-wrappers/JavaInteger";
import { NullableMarshaller } from "./NullableMarshaller";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";
import { ErraiObject } from "../model/ErraiObject";
import { instanceOfNumber } from "../../util/TypeUtils";

export class JavaIntegerMarshaller extends NullableMarshaller<JavaInteger, number, ErraiObject | number, JavaInteger> {
  public notNullMarshall(input: JavaInteger, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaInteger {
    if (instanceOfNumber(input)) {
      return new JavaInteger(input.toString(10));
    }

    return JavaIntegerMarshaller.fromErraiObject(input);
  }

  private static fromErraiObject(input: ErraiObject) {
    const valueFromJson = input[ErraiObjectConstants.NUM_VAL];
    if (!instanceOfNumber(valueFromJson)) {
      throw new Error(`Invalid integer value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaInteger(valueFromJson.toString(10));
  }
}
