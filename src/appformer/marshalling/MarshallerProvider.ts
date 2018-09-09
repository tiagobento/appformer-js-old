import JavaWrapper, { JavaType } from "appformer/java-wrappers/JavaWrapper";
import Marshaller from "appformer/marshalling/Marshaller";
import JavaHashMapMarshaller from "appformer/marshalling/marshallers/JavaHashMapMarshaller";
import JavaShortMarshaller from "appformer/marshalling/marshallers/JavaShortMarshaller";
import JavaDoubleMarshaller from "appformer/marshalling/marshallers/JavaDoubleMarshaller";
import DefaultMarshaller from "appformer/marshalling/marshallers/DefaultMarshaller";
import JavaStringMarshaller from "appformer/marshalling/marshallers/JavaStringMarshaller";
import JavaIntegerMarshaller from "appformer/marshalling/marshallers/JavaIntegerMarshaller";
import JavaBigIntegerMarshaller from "appformer/marshalling/marshallers/JavaBigIntegerMarshaller";
import JavaFloatMarshaller from "appformer/marshalling/marshallers/JavaFloatMarshaller";
import JavaBooleanMarshaller from "appformer/marshalling/marshallers/JavaBooleanMarshaller";
import JavaLongMarshaller from "appformer/marshalling/marshallers/JavaLongMarshaller";
import JavaBigDecimalMarshaller from "appformer/marshalling/marshallers/JavaBigDecimalMarshaller";
import JavaByteMarshaller from "appformer/marshalling/marshallers/JavaByteMarshaller";
import {
  JavaArrayListMarshaller,
  JavaHashSetMarshaller
} from "appformer/marshalling/marshallers/JavaCollectionMarshaller";
import JavaDateMarshaller from "appformer/marshalling/marshallers/JavaDateMarshaller";

export default class MarshallerProvider {
  private static initialized: boolean = false;

  private static marshallersByJavaType: Map<string, Marshaller<any, any>>;
  private static defaultMarshaller: Marshaller<any, any>;

  public static initialize() {
    if (this.initialized) {
      return;
    }

    this.defaultMarshaller = new DefaultMarshaller();

    this.marshallersByJavaType = new Map();
    this.marshallersByJavaType.set(JavaType.BYTE, new JavaByteMarshaller());
    this.marshallersByJavaType.set(JavaType.DOUBLE, new JavaDoubleMarshaller());
    this.marshallersByJavaType.set(JavaType.FLOAT, new JavaFloatMarshaller());
    this.marshallersByJavaType.set(JavaType.INTEGER, new JavaIntegerMarshaller());
    this.marshallersByJavaType.set(JavaType.LONG, new JavaLongMarshaller());
    this.marshallersByJavaType.set(JavaType.SHORT, new JavaShortMarshaller());
    this.marshallersByJavaType.set(JavaType.BOOLEAN, new JavaBooleanMarshaller());
    this.marshallersByJavaType.set(JavaType.STRING, new JavaStringMarshaller());
    this.marshallersByJavaType.set(JavaType.DATE, new JavaDateMarshaller());

    this.marshallersByJavaType.set(JavaType.BIG_DECIMAL, new JavaBigDecimalMarshaller());
    this.marshallersByJavaType.set(JavaType.BIG_INTEGER, new JavaBigIntegerMarshaller());

    this.marshallersByJavaType.set(JavaType.ARRAY_LIST, new JavaArrayListMarshaller());
    this.marshallersByJavaType.set(JavaType.HASH_SET, new JavaHashSetMarshaller());
    this.marshallersByJavaType.set(JavaType.HASH_MAP, new JavaHashMapMarshaller());
    this.initialized = true;
  }

  public static getFor(obj: any): Marshaller<any, any> {
    if (!this.initialized) {
      throw new Error("MarshallerProvider should be initialized before using it.");
    }

    const fqcn = obj._fqcn;
    if (!fqcn) {
      return this.defaultMarshaller;
    }

    if (!JavaWrapper.isJavaType(fqcn)) {
      // portable objects defines an fqcn but we don't have default marshallers for it.
      return this.defaultMarshaller;
    }

    const marshaller = MarshallerProvider.marshallersByJavaType.get(fqcn);
    if (!marshaller) {
      throw new Error(`Missing marshaller implementation for type ${fqcn}`);
    }

    return marshaller;
  }
}
