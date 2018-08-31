import Marshaller from "./Marshaller";
import JavaBigInteger from "../../java-wrapper/JavaBigInteger";
import ErraiObject from "../model/ErraiObject";
import MarshallingContext from "../MarshallingContext";
import ErraiObjectConstants from "../model/ErraiObjectConstants";

export default class JavaBigIntegerMarshaller implements Marshaller<JavaBigInteger, ErraiObject> {
  public marshall(input: JavaBigInteger, ctx: MarshallingContext): ErraiObject {
    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.VALUE]: `${input.get().toString(10)}`
    } as ErraiObject;
  }
}
