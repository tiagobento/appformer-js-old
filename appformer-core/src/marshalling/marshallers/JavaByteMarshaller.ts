import {NullableMarshaller} from "./NullableMarshaller";
import {JavaByte} from "../../java-wrappers";
import {MarshallingContext} from "../MarshallingContext";

export  class JavaByteMarshaller extends NullableMarshaller<JavaByte, number> {
  public notNullMarshall(input: JavaByte, ctx: MarshallingContext): number {
    return input.get();
  }
}
