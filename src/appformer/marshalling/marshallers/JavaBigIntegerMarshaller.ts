import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import JavaBigInteger from "appformer/java-wrappers/JavaBigInteger";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaBigIntegerMarshaller extends NullableMarshaller<JavaBigInteger, ErraiObject> {
  public notNullMarshall(input: JavaBigInteger, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.incrementAndGetObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
