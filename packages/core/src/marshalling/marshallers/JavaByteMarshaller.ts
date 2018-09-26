import { NullableMarshaller } from "./NullableMarshaller";
import { JavaByte } from "../../java-wrappers/JavaByte";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ErraiObject } from "../model/ErraiObject";
import { instanceOfNumber } from "../../util/TypeUtils";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";

export class JavaByteMarshaller extends NullableMarshaller<JavaByte, number, ErraiObject | number, JavaByte> {
  public notNullMarshall(input: JavaByte, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaByte {
    if (instanceOfNumber(input)) {
      return new JavaByte(input.toString(10));
    }

    return JavaByteMarshaller.fromErraiObject(input);
  }

  private static fromErraiObject(input: ErraiObject) {
    const valueFromJson = input[ErraiObjectConstants.NUM_VAL];
    if (!instanceOfNumber(valueFromJson)) {
      throw new Error(`Invalid byte value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaByte(valueFromJson.toString(10));
  }
}
