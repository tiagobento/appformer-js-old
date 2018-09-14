import JavaShort from "appformer/java-wrappers/JavaShort";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaShortMarshaller extends NullableMarshaller<JavaShort, number> {
  public notNullMarshall(input: JavaShort, ctx: MarshallingContext): number {
    return input.get();
  }
}
