import Marshaller from "./Marshaller";
import { ErraiObject } from "./model/ErraiObject";
import { MarshallingContext } from "./ErraiMarshaller";
import { JavaString } from "../internal/model/numbers/JavaString";

export default class JavaStringMarshaller implements Marshaller<JavaString, ErraiObject> {
  public marshall(input: JavaString, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
