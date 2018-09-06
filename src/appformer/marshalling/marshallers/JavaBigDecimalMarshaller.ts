import Marshaller from "../Marshaller";
import JavaBigDecimal from "../../java-wrappers/JavaBigDecimal";
import MarshallingContext from "../MarshallingContext";
import ErraiObject from "../model/ErraiObject";
import ErraiObjectConstants from "../model/ErraiObjectConstants";

export default class JavaBigDecimalMarshaller implements Marshaller<JavaBigDecimal, ErraiObject> {
  public marshall(input: JavaBigDecimal, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.newObjectId()}`,
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
