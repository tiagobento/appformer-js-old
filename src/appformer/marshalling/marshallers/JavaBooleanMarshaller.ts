import MarshallingContext from "../MarshallingContext";
import JavaBoolean from "../../java-wrappers/JavaBoolean";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaBooleanMarshaller extends NullableMarshaller<JavaBoolean, boolean> {
  public notNullMarshall(input: JavaBoolean, ctx: MarshallingContext): boolean {
    return input.get();
  }
}
