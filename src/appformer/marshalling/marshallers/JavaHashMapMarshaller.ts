import JavaHashMap from "../../java-wrappers/JavaHashMap";
import MarshallingContext from "../MarshallingContext";
import ErraiObject from "../model/ErraiObject";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaHashMapMarshaller<T, U> extends NullableMarshaller<JavaHashMap<T, U>, ErraiObject> {
  public notNullMarshall(input: JavaHashMap<T, U>, ctx: MarshallingContext): ErraiObject {
    // TODO
    return {};
  }
}
