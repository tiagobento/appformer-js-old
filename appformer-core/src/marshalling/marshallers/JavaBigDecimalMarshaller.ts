import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";
import { JavaBigDecimal } from "java-wrappers/JavaBigDecimal";
import { ErraiObjectConstants } from "marshalling/model/ErraiObjectConstants";
import { ErraiObject } from "marshalling/model/ErraiObject";
import { MarshallingContext } from "marshalling/MarshallingContext";

export class JavaBigDecimalMarshaller extends NullableMarshaller<JavaBigDecimal, ErraiObject> {
  public notNullMarshall(input: JavaBigDecimal, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.incrementAndGetObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
