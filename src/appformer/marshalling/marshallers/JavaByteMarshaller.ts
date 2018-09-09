import JavaByte from "../../java-wrappers/JavaByte";
import MarshallingContext from "../MarshallingContext";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaByteMarshaller extends NullableMarshaller<JavaByte, number> {
  public notNullMarshall(input: JavaByte, ctx: MarshallingContext): number {
    return input.get();
  }
}
