import JavaDouble from "../../java-wrappers/JavaDouble";
import MarshallingContext from "../MarshallingContext";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaDoubleMarshaller extends NullableMarshaller<JavaDouble, number> {
  public notNullMarshall(input: JavaDouble, ctx: MarshallingContext): number {
    return input.get();
  }
}
