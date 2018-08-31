import { JavaType } from "appformer/java-wrapper/JavaWrapper";
import Marshaller from "appformer/marshalling/marshallers/Marshaller";
import JavaByteMarshaller from "appformer/marshalling/marshallers/JavaByteMarshaller";
import JavaDoubleMarshaller from "appformer/marshalling/marshallers/JavaDoubleMarshaller";
import JavaFloatMarshaller from "appformer/marshalling/marshallers/JavaFloatMarshaller";
import JavaIntegerMarshaller from "appformer/marshalling/marshallers/JavaIntegerMarshaller";
import JavaLongMarshaller from "appformer/marshalling/marshallers/JavaLongMarshaller";
import JavaShortMarshaller from "appformer/marshalling/marshallers/JavaShortMarshaller";
import JavaBooleanMarshaller from "appformer/marshalling/marshallers/JavaBooleanMarshaller";
import JavaStringMarshaller from "appformer/marshalling/marshallers/JavaStringMarshaller";
import JavaBigDecimalMarshaller from "appformer/marshalling/marshallers/JavaBigDecimalMarshaller";
import JavaBigIntegerMarshaller from "appformer/marshalling/marshallers/JavaBigIntegerMarshaller";
import JavaArrayListMarshaller from "appformer/marshalling/marshallers/JavaArrayListMarshaller";
import JavaHashSetMarshaller from "appformer/marshalling/marshallers/JavaHashSetMarshaller";
import JavaHashMapMarshaller from "appformer/marshalling/marshallers/JavaHashMapMarshaller";

export default class MarshallerProvider {
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
