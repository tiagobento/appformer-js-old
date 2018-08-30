import Marshaller from "./Marshaller";
import { ErraiObject } from "./model/ErraiObject";
import { JavaHashMap } from "../internal/model/numbers/JavaHashMap";
import { MarshallingContext } from "./MarshallingContext";

export default class JavaHashMapMarshaller implements Marshaller<JavaHashMap, ErraiObject> {
  public marshall(input: JavaHashMap, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
