import Marshaller from "appformer/marshalling/marshallers/Marshaller";
import JavaShort from "appformer/java-wrapper/JavaShort";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export default class JavaShortMarshaller implements Marshaller<JavaShort, number> {
  public marshall(input: JavaShort, ctx: MarshallingContext): number {
    return input.get();
  }
}
