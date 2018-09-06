import Marshaller from "../Marshaller";
import JavaDouble from "../../java-wrappers/JavaDouble";
import MarshallingContext from "../MarshallingContext";

export default class JavaDoubleMarshaller implements Marshaller<JavaDouble, number> {
  public marshall(input: JavaDouble, ctx: MarshallingContext): number {
    return input.get();
  }
}
