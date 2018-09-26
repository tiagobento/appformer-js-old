import { NullableMarshaller } from "./NullableMarshaller";
import { JavaDate } from "../../java-wrappers/JavaDate";
import { ErraiObject } from "../model/ErraiObject";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { instanceOfNumber } from "../../util/TypeUtils";

export class JavaDateMarshaller extends NullableMarshaller<JavaDate, ErraiObject, ErraiObject, Date> {
  public notNullMarshall(input: JavaDate, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.VALUE]: `${input.get().getTime()}`
    };
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): Date {
    const valueFromJson = input[ErraiObjectConstants.VALUE];
    if (!JavaDateMarshaller.isValid(valueFromJson)) {
      throw new Error(`Invalid date value ${valueFromJson}. Can't unmarshall json ${input}`);
    }

    return new Date(valueFromJson);
  }

  private static isValid(input: any) {
    return instanceOfNumber(input) && input >= 0;
  }
}
