import { JavaWrapperUtils } from "java-wrappers/JavaWrapperUtils";
import { JavaType } from "java-wrappers/JavaType";
import { Marshaller } from "marshalling/Marshaller";
import { JavaHashMapMarshaller } from "marshalling/marshallers/JavaHashMapMarshaller";
import { JavaShortMarshaller } from "marshalling/marshallers/JavaShortMarshaller";
import { JavaDoubleMarshaller } from "marshalling/marshallers/JavaDoubleMarshaller";
import { DefaultMarshaller } from "marshalling/marshallers/DefaultMarshaller";
import { JavaStringMarshaller } from "marshalling/marshallers/JavaStringMarshaller";
import { JavaIntegerMarshaller } from "marshalling/marshallers/JavaIntegerMarshaller";
import { JavaBigIntegerMarshaller } from "marshalling/marshallers/JavaBigIntegerMarshaller";
import { JavaFloatMarshaller } from "marshalling/marshallers/JavaFloatMarshaller";
import { JavaBooleanMarshaller } from "marshalling/marshallers/JavaBooleanMarshaller";
import { JavaLongMarshaller } from "marshalling/marshallers/JavaLongMarshaller";
import { JavaBigDecimalMarshaller } from "marshalling/marshallers/JavaBigDecimalMarshaller";
import { JavaByteMarshaller } from "marshalling/marshallers/JavaByteMarshaller";
import { JavaDateMarshaller } from "marshalling/marshallers/JavaDateMarshaller";
import { JavaOptionalMarshaller } from "marshalling/marshallers/JavaOptionalMarshaller";
import {
    JavaArrayListMarshaller,
    JavaHashSetMarshaller
} from "marshalling/marshallers/JavaCollectionMarshaller";

export class MarshallerProvider {
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

    this.marshallersByJavaType.set(JavaType.OPTIONAL, new JavaOptionalMarshaller());

    this.initialized = true;
  }

  public static getFor(obj: any): Marshaller<any, any> {
    if (!this.initialized) {
      throw new Error("MarshallerProvider should be initialized before using it.");
    }

    if (obj === null || undefined) {
      return this.defaultMarshaller;
    }

    const fqcn = obj._fqcn;
    if (!fqcn) {
      return this.defaultMarshaller;
    }

    if (!JavaWrapperUtils.isJavaType(fqcn)) {
      // portable objects defines an fqcn but we don't have specific marshallers for it.
      return this.defaultMarshaller;
    }

    const marshaller = MarshallerProvider.marshallersByJavaType.get(fqcn);
    if (!marshaller) {
      throw new Error(`Missing marshaller implementation for type ${fqcn}`);
    }

    return marshaller;
  }
}
