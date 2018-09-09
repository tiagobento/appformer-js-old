import JavaBigInteger from "../../java-wrappers/JavaBigInteger";
import ErraiObject from "../model/ErraiObject";
import MarshallingContext from "../MarshallingContext";
import ErraiObjectConstants from "../model/ErraiObjectConstants";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaBigIntegerMarshaller extends NullableMarshaller<JavaBigInteger, ErraiObject> {
  public notNullMarshall(input: JavaBigInteger, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.newObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
