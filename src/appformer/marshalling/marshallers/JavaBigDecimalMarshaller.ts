import JavaBigDecimal from "../../java-wrappers/JavaBigDecimal";
import MarshallingContext from "../MarshallingContext";
import ErraiObject from "../model/ErraiObject";
import ErraiObjectConstants from "../model/ErraiObjectConstants";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaBigDecimalMarshaller extends NullableMarshaller<JavaBigDecimal, ErraiObject> {
  public notNullMarshall(input: JavaBigDecimal, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.newObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
