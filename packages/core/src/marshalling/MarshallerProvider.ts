import { JavaWrapperUtils } from "../java-wrappers/JavaWrapperUtils";
import { JavaType } from "../java-wrappers/JavaType";
import { Marshaller } from "./Marshaller";
import { JavaHashMapMarshaller } from "./marshallers/JavaHashMapMarshaller";
import { JavaShortMarshaller } from "./marshallers/JavaShortMarshaller";
import { JavaDoubleMarshaller } from "./marshallers/JavaDoubleMarshaller";
import { DefaultMarshaller } from "./marshallers/DefaultMarshaller";
import { JavaStringMarshaller } from "./marshallers/JavaStringMarshaller";
import { JavaIntegerMarshaller } from "./marshallers/JavaIntegerMarshaller";
import { JavaBigIntegerMarshaller } from "./marshallers/JavaBigIntegerMarshaller";
import { JavaFloatMarshaller } from "./marshallers/JavaFloatMarshaller";
import { JavaBooleanMarshaller } from "./marshallers/JavaBooleanMarshaller";
import { JavaLongMarshaller } from "./marshallers/JavaLongMarshaller";
import { JavaBigDecimalMarshaller } from "./marshallers/JavaBigDecimalMarshaller";
import { JavaByteMarshaller } from "./marshallers/JavaByteMarshaller";
import { JavaDateMarshaller } from "./marshallers/JavaDateMarshaller";
import { JavaOptionalMarshaller } from "./marshallers/JavaOptionalMarshaller";
import { JavaArrayListMarshaller, JavaHashSetMarshaller } from "./marshallers/JavaCollectionMarshaller";
import { Portable } from "../internal";

export class MarshallerProvider {
  private static initialized: boolean = false;

  private static marshallersByJavaType: Map<string, Marshaller<any, any, any, any>>;
  private static defaultMarshaller: Marshaller<any, any, any, any>;

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

  public static getForObject(obj: Portable<any>): Marshaller<any, any, any, any> {
    this.assertInitialization();

    if (obj === null || obj === undefined) {
      return this.defaultMarshaller;
    }

    const fqcn = (obj as any)._fqcn;
    if (!fqcn) {
      return this.defaultMarshaller;
    }

    return this.getForFqcn(fqcn);
  }

  public static getForFqcn(fqcn: string): Marshaller<any, any, any, any> {
    this.assertInitialization();

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

  private static assertInitialization() {
    if (!this.initialized) {
      throw new Error("Initialize MarshallerProvider before using.");
    }
  }
}
