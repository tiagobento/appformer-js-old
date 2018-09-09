import JavaFloat from "../../java-wrappers/JavaFloat";
import MarshallingContext from "../MarshallingContext";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class JavaFloatMarshaller extends NullableMarshaller<JavaFloat, number> {
  public notNullMarshall(input: JavaFloat, ctx: MarshallingContext): number {
    return input.get();
  }
}
