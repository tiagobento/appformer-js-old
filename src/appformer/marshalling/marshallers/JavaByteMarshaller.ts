import Marshaller from "./Marshaller";
import JavaByte from "../../java-wrapper/JavaByte";
import MarshallingContext from "../MarshallingContext";

export default class JavaByteMarshaller implements Marshaller<JavaByte, number> {
  public marshall(input: JavaByte, ctx: MarshallingContext): number {
    return input.get();
  }
}
