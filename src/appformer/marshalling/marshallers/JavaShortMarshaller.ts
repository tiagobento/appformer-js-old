import Marshaller from "appformer/marshalling/Marshaller";
import JavaShort from "appformer/java-wrappers/JavaShort";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaShortMarshaller implements Marshaller<JavaShort, number> {
  public marshall(input: JavaShort, ctx: MarshallingContext): number {
    return input.get();
  }
}
