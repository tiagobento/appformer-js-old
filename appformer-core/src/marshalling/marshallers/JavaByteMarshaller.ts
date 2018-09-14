import { NullableMarshaller } from "marshalling/marshallers/NullableMarshaller";
import { JavaByte } from "java-wrappers/JavaByte";
import { MarshallingContext } from "marshalling/MarshallingContext";

export  class JavaByteMarshaller extends NullableMarshaller<JavaByte, number> {
  public notNullMarshall(input: JavaByte, ctx: MarshallingContext): number {
    return input.get();
  }
}
