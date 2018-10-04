import { NullableMarshaller } from "./NullableMarshaller";
import { JavaByte } from "../../java-wrappers/JavaByte";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { ErraiObject } from "../model/ErraiObject";
import { instanceOfNumber } from "../../util/TypeUtils";
import { NumValBasedErraiObject } from "../model/NumValBasedErraiObject";
import { NumberUtils } from "../../util/NumberUtils";

export class JavaByteMarshaller extends NullableMarshaller<JavaByte, number, ErraiObject | number, JavaByte> {
  public notNullMarshall(input: JavaByte, ctx: MarshallingContext): number {
    return input.get();
  }

  public notNullUnmarshall(input: ErraiObject | number, ctx: UnmarshallingContext): JavaByte {
    const valueFromJson = instanceOfNumber(input) ? input : NumValBasedErraiObject.from(input).numVal;
    if (!JavaByteMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid byte value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaByte(`${valueFromJson}`);
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
