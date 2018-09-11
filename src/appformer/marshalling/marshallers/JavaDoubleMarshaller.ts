import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaDoubleMarshaller extends NullableMarshaller<JavaDouble, number> {
  public notNullMarshall(input: JavaDouble, ctx: MarshallingContext): number {
    return input.get();
  }
}
