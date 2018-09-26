import { JavaShort } from "../../java-wrappers/JavaShort";
import { MarshallingContext } from "../MarshallingContext";
import { NullableMarshaller } from "./NullableMarshaller";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { instanceOfNumber } from "../../util/TypeUtils";
import { ErraiObject } from "../model/ErraiObject";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";

export class JavaShortMarshaller extends NullableMarshaller<JavaShort, number, ErraiObject | number, JavaShort> {
  public notNullMarshall(input: JavaShort, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaShort {
    if (instanceOfNumber(input)) {
      return new JavaShort(input.toString(10));
    }

    return JavaShortMarshaller.fromErraiObject(input);
  }

  private static fromErraiObject(input: ErraiObject) {
    const valueFromJson = input[ErraiObjectConstants.NUM_VAL];
    if (!instanceOfNumber(valueFromJson)) {
      throw new Error(`Invalid short value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaShort(valueFromJson.toString(10));
  }
}
