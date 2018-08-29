import Marshaller from "./Marshaller";
import { ErraiObject, ErraiObjectConstants } from "./model/ErraiObject";
import { JavaBigInteger } from "../internal/model/numbers/JavaBigInteger";
import { MarshallingContext } from "./ErraiMarshaller";

export default class JavaBigIntegerMarshaller implements Marshaller<JavaBigInteger, ErraiObject> {
  public marshall(input: JavaBigInteger, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
