import { JavaLong } from "../../java-wrappers/JavaLong";
import { ErraiObject } from "../model/ErraiObject";
import { MarshallingContext } from "../MarshallingContext";
import { NullableMarshaller } from "./NullableMarshaller";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { NumValBasedErraiObject } from "../model/NumValBasedErraiObject";
import { NumberUtils } from "../../util/NumberUtils";

export class JavaLongMarshaller extends NullableMarshaller<JavaLong, ErraiObject, ErraiObject, JavaLong> {
  public notNullMarshall(input: JavaLong, ctx: MarshallingContext): ErraiObject {
    const asString = `${input.get().toString(10)}`;
    return new NumValBasedErraiObject((input as any)._fqcn, asString).asErraiObject();
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): JavaLong {
    const valueFromJson = NumValBasedErraiObject.from(input).numVal as string;

    if (!JavaLongMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid long value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new JavaLong(valueFromJson);
  }

  private static isValid(jsonValue: string) {
    if (jsonValue === null || jsonValue === undefined) {
      return false;
    }

    return NumberUtils.isIntegerString(jsonValue);
  }
}
