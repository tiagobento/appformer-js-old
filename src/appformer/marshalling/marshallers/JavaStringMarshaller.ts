import Marshaller from "appformer/marshalling/marshallers/Marshaller";
import JavaString from "appformer/java-wrapper/JavaString";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaStringMarshaller implements Marshaller<JavaString, string> {
  public marshall(input: JavaString, ctx: MarshallingContext): string {
    return input.get();
  }
}
