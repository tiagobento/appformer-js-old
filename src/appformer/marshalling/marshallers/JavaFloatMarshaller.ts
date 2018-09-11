import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaFloatMarshaller extends NullableMarshaller<JavaFloat, number> {
  public notNullMarshall(input: JavaFloat, ctx: MarshallingContext): number {
    return input.get();
  }
}
