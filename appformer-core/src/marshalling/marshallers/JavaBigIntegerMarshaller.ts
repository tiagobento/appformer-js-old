import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";
import { JavaBigInteger } from "java-wrappers/JavaBigInteger";
import { ErraiObjectConstants } from "marshalling/model/ErraiObjectConstants";
import { ErraiObject } from "marshalling/model/ErraiObject";
import { MarshallingContext } from "marshalling/MarshallingContext";

export  class JavaBigIntegerMarshaller extends NullableMarshaller<JavaBigInteger, ErraiObject> {
  public notNullMarshall(input: JavaBigInteger, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.incrementAndGetObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
