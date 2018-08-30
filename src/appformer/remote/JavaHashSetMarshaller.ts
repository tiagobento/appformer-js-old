import Marshaller from "./Marshaller";
import { ErraiObject } from "./model/ErraiObject";
import { JavaHashSet } from "../internal/model/numbers/JavaHashSet";
import { MarshallingContext } from "./MarshallingContext";

export default class JavaHashSetMarshaller implements Marshaller<JavaHashSet, ErraiObject> {
  public marshall(input: JavaHashSet, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
