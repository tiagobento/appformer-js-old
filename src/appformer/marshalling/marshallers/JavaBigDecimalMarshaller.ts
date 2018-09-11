import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import JavaBigDecimal from "appformer/java-wrappers/JavaBigDecimal";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaBigDecimalMarshaller extends NullableMarshaller<JavaBigDecimal, ErraiObject> {
  public notNullMarshall(input: JavaBigDecimal, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.newObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
