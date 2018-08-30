import Marshaller from "./Marshaller";
import { ErraiObject, ErraiObjectConstants } from "./model/ErraiObject";
import { JavaLong } from "../internal/model/numbers/JavaLong";
import { MarshallingContext } from "./MarshallingContext";

export default class JavaLongMarshaller implements Marshaller<JavaLong, ErraiObject> {
  public marshall(input: JavaLong, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: `${input.get().toString(10)}`
    };
  }
}
