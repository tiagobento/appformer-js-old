import MarshallingContext from "appformer/marshalling/MarshallingContext";
import Marshaller from "appformer/marshalling/Marshaller";
import JavaInteger from "appformer/java-wrapper/JavaInteger";

export default class JavaIntegerMarshaller implements Marshaller<JavaInteger, number> {
  public marshall(input: JavaInteger, ctx: MarshallingContext): number {
    return input.get();
  }
}
