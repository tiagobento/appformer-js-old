import { NullableMarshaller } from "./NullableMarshaller";
import { JavaBigInteger } from "../../java-wrappers/JavaBigInteger";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";
import { ErraiObject } from "../model/ErraiObject";
import { MarshallingContext } from "../MarshallingContext";
import { UnmarshallingContext } from "../UnmarshallingContext";

export class JavaBigIntegerMarshaller extends NullableMarshaller<
  JavaBigInteger,
  ErraiObject,
  ErraiObject,
  JavaBigInteger
> {
  public notNullMarshall(input: JavaBigInteger, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.incrementAndGetObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): JavaBigInteger {
    return new JavaBigInteger(input[ErraiObjectConstants.VALUE] as string);
  }
}
