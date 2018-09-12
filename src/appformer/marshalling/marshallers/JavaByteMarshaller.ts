import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";
import JavaByte from "appformer/java-wrappers/JavaByte";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaByteMarshaller extends NullableMarshaller<JavaByte, number> {
  public notNullMarshall(input: JavaByte, ctx: MarshallingContext): number {
    return input.get();
  }
}
