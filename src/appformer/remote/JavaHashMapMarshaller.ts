import Marshaller from "./Marshaller";
import { ErraiObject } from "./model/ErraiObject";
import { MarshallingContext } from "./ErraiMarshaller";
import { JavaHashMap } from "../internal/model/numbers/JavaHashMap";

export default class JavaHashMapMarshaller implements Marshaller<JavaHashMap, ErraiObject> {
  public marshall(input: JavaHashMap, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
