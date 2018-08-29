import Marshaller from "./Marshaller";
import { ErraiObject } from "./model/ErraiObject";
import { MarshallingContext } from "./ErraiMarshaller";
import { JavaBoolean } from "../internal/model/numbers/JavaBoolean";

export default class JavaBooleanMarshaller implements Marshaller<JavaBoolean, ErraiObject> {
  public marshall(input: JavaBoolean, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
