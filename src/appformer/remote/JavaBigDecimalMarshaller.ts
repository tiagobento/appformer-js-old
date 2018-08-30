import Marshaller from "./Marshaller";
import { ErraiObject, ErraiObjectConstants } from "./model/ErraiObject";
import { JavaBigDecimal } from "../internal/model/numbers/JavaBigDecimal";
import { MarshallingContext } from "./MarshallingContext";

export default class JavaBigDecimalMarshaller implements Marshaller<JavaBigDecimal, ErraiObject> {
  public marshall(input: JavaBigDecimal, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
