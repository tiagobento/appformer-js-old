import Marshaller from "./Marshaller";
import MarshallingContext from "../MarshallingContext";
import JavaBoolean from "../../java-wrapper/JavaBoolean";

export default class JavaBooleanMarshaller implements Marshaller<JavaBoolean, boolean> {
  public marshall(input: JavaBoolean, ctx: MarshallingContext): boolean {
    return input.get();
  }
}
