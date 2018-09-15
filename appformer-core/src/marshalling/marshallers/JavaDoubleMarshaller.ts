import { NullableMarshaller } from "../marshallers/NullableMarshaller";
import { JavaDouble } from "../../java-wrappers/JavaDouble";
import { MarshallingContext } from "../MarshallingContext";

export  class JavaDoubleMarshaller extends NullableMarshaller<JavaDouble, number> {
  public notNullMarshall(input: JavaDouble, ctx: MarshallingContext): number {
    return input.get();
  }
}
