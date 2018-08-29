import Marshaller from "./Marshaller";
import { ErraiObject } from "./model/ErraiObject";
import { MarshallingContext } from "./ErraiMarshaller";
import { JavaHashSet } from "../internal/model/numbers/JavaHashSet";

export default class JavaHashSetMarshaller implements Marshaller<JavaHashSet, ErraiObject> {
  public marshall(input: JavaHashSet, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
