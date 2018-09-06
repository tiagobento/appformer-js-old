import Marshaller from "appformer/marshalling/Marshaller";
import JavaString from "appformer/java-wrappers/JavaString";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaStringMarshaller implements Marshaller<JavaString, string> {
  public marshall(input: JavaString, ctx: MarshallingContext): string {
    return input.get();
  }
}
