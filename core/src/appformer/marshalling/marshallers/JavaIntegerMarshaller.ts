import MarshallingContext from "appformer/marshalling/MarshallingContext";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaIntegerMarshaller extends NullableMarshaller<JavaInteger, number> {
  public notNullMarshall(input: JavaInteger, ctx: MarshallingContext): number {
    return input.get();
  }
}
