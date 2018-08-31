import Marshaller from "./Marshaller";
import JavaFloat from "../../java-wrapper/JavaFloat";
import MarshallingContext from "../MarshallingContext";

export default class JavaFloatMarshaller implements Marshaller<JavaFloat, number> {
  public marshall(input: JavaFloat, ctx: MarshallingContext): number {
    return input.get();
  }
}
