import Marshaller from "../Marshaller";
import JavaHashMap from "../../java-wrappers/JavaHashMap";
import MarshallingContext from "../MarshallingContext";
import ErraiObject from "../model/ErraiObject";

export default class JavaHashMapMarshaller implements Marshaller<JavaHashMap, ErraiObject> {
  public marshall(input: JavaHashMap, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
