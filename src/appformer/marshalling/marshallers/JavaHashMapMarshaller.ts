import Marshaller from "../Marshaller";
import JavaHashMap from "../../java-wrappers/JavaHashMap";
import MarshallingContext from "../MarshallingContext";
import ErraiObject from "../model/ErraiObject";

export default class JavaHashMapMarshaller<T, U> implements Marshaller<JavaHashMap<T, U>, ErraiObject> {
  public marshall(input: JavaHashMap<T, U>, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
