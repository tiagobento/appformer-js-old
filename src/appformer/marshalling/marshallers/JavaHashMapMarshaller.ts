import Marshaller from "../Marshaller";
import JavaHashMap from "../../java-wrapper/JavaHashMap";
import MarshallingContext from "../MarshallingContext";
import ErraiObject from "../model/ErraiObject";

export default class JavaHashMapMarshaller implements Marshaller<JavaHashMap, ErraiObject> {
  public marshall(input: JavaHashMap, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
