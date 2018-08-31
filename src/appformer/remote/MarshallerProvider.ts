import Marshaller from "./Marshaller";
import { JavaType } from "../internal/model/numbers/JavaWrapper";
import JavaByteMarshaller from "./JavaByteMarshaller";
import JavaDoubleMarshaller from "./JavaDoubleMarshaller";
import JavaFloatMarshaller from "./JavaFloatMarshaller";
import JavaIntegerMarshaller from "./JavaIntegerMarshaller";
import JavaLongMarshaller from "./JavaLongMarshaller";
import JavaShortMarshaller from "./JavaShortMarshaller";
import JavaBooleanMarshaller from "./JavaBooleanMarshaller";
import JavaStringMarshaller from "./JavaStringMarshaller";
import JavaBigDecimalMarshaller from "./JavaBigDecimalMarshaller";
import JavaBigIntegerMarshaller from "./JavaBigIntegerMarshaller";
import JavaHashSetMarshaller from "./JavaHashSetMarshaller";
import JavaHashMapMarshaller from "./JavaHashMapMarshaller";
import JavaArrayListMarshaller from "./JavaArrayListMarshaller";

export class MarshallerProvider {
  private static marshallersByJavaType: Map<string, Marshaller<any, any>>;

  public static initialize() {
    if (this.marshallersByJavaType !== undefined) {
      return;
    }

    this.marshallersByJavaType = new Map();
    MarshallerProvider.marshallersByJavaType.set(JavaType.BYTE, new JavaByteMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.DOUBLE, new JavaDoubleMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.FLOAT, new JavaFloatMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.INTEGER, new JavaIntegerMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.LONG, new JavaLongMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.SHORT, new JavaShortMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.BOOLEAN, new JavaBooleanMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.STRING, new JavaStringMarshaller());

    MarshallerProvider.marshallersByJavaType.set(JavaType.BIG_DECIMAL, new JavaBigDecimalMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.BIG_INTEGER, new JavaBigIntegerMarshaller());

    MarshallerProvider.marshallersByJavaType.set(JavaType.ARRAY_LIST, new JavaArrayListMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.HASH_SET, new JavaHashSetMarshaller());
    MarshallerProvider.marshallersByJavaType.set(JavaType.HASH_MAP, new JavaHashMapMarshaller());
  }

  public static getFor(fqcn: string): Marshaller<any, any> {
    const marshaller = MarshallerProvider.marshallersByJavaType.get(fqcn);
    if (!marshaller) {
      throw new Error(`Missing marshaller implementation for type ${fqcn}`);
    }

    return marshaller;
  }
}
