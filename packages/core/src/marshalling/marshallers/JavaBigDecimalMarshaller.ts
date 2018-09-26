import { NullableMarshaller } from "./NullableMarshaller";
import { JavaBigDecimal } from "../../java-wrappers/JavaBigDecimal";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";
import { ErraiObject } from "../model/ErraiObject";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";

export class JavaBigDecimalMarshaller extends NullableMarshaller<
  JavaBigDecimal,
  ErraiObject,
  ErraiObject,
  JavaBigDecimal
> {
  public notNullMarshall(input: JavaBigDecimal, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.incrementAndGetObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): JavaBigDecimal {
    return new JavaBigDecimal(input[ErraiObjectConstants.VALUE] as string);
  }
}
