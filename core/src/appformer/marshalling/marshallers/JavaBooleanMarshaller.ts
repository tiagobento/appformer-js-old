import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaBooleanMarshaller extends NullableMarshaller<JavaBoolean, boolean> {
  public notNullMarshall(input: JavaBoolean, ctx: MarshallingContext): boolean {
    return input.get();
  }
}
