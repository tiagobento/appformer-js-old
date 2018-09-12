import JavaString from "appformer/java-wrappers/JavaString";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaStringMarshaller extends NullableMarshaller<JavaString, string> {
  public notNullMarshall(input: JavaString, ctx: MarshallingContext): string {
    return input.get();
  }
}
