import {MarshallerProvider} from "../MarshallerProvider";
import {JavaBigIntegerMarshaller} from "../marshallers/JavaBigIntegerMarshaller";
import {JavaHashSet} from "../../java-wrappers/JavaHashSet";
import {JavaByte} from "../../java-wrappers/JavaByte";
import {JavaBigInteger} from "../../java-wrappers/JavaBigInteger";
import {JavaHashMap} from "../../java-wrappers/JavaHashMap";
import {JavaArrayList} from "../../java-wrappers/JavaArrayList";
import {JavaString} from "../../java-wrappers/JavaString";
import {JavaHashMapMarshaller} from "../marshallers/JavaHashMapMarshaller";
import {JavaByteMarshaller} from "../marshallers/JavaByteMarshaller";
import {JavaBigDecimal} from "../../java-wrappers/JavaBigDecimal";
import {JavaBigDecimalMarshaller} from "../marshallers/JavaBigDecimalMarshaller";
import {JavaStringMarshaller} from "../marshallers/JavaStringMarshaller";
import {JavaBoolean} from "../../java-wrappers/JavaBoolean";
import {JavaBooleanMarshaller} from "../marshallers/JavaBooleanMarshaller";
import {JavaShort} from "../../java-wrappers/JavaShort";
import {JavaShortMarshaller} from "../marshallers/JavaShortMarshaller";
import {JavaLong} from "../../java-wrappers/JavaLong";
import {JavaLongMarshaller} from "../marshallers/JavaLongMarshaller";
import {JavaIntegerMarshaller} from "../marshallers/JavaIntegerMarshaller";
import {JavaInteger} from "../../java-wrappers/JavaInteger";
import {JavaFloat} from "../../java-wrappers/JavaFloat";
import {JavaFloatMarshaller} from "../marshallers/JavaFloatMarshaller";
import {JavaDouble} from "../../java-wrappers/JavaDouble";
import {JavaDoubleMarshaller} from "../marshallers/JavaDoubleMarshaller";
import {DefaultMarshaller} from "../marshallers/DefaultMarshaller";
import {JavaWrapperUtils} from "../../java-wrappers/JavaWrapperUtils";
import {JavaType} from "../../java-wrappers/JavaType";
import * as JavaCollectionMarshaller from "../marshallers/JavaCollectionMarshaller";
import {JavaDate} from "../../java-wrappers/JavaDate";
import {JavaDateMarshaller} from "../marshallers/JavaDateMarshaller";
import {JavaOptional} from "../../java-wrappers/JavaOptional";
import {JavaOptionalMarshaller} from "../marshallers/JavaOptionalMarshaller";

describe("getFor", () => {
  test("without initialize, should return Error", () => {
    const input = new JavaString("foo");
    expect(() => MarshallerProvider.getFor(input)).toThrowError();
  });

  describe("properly initialized", () => {
    beforeEach(() => {
      (MarshallerProvider as any).initialized = false; // force reinitialization
      MarshallerProvider.initialize();
    });

    test("with JavaByte instance, should return JavaByteMarshaller instance", () => {
      const input = new JavaByte("1");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaByteMarshaller());
    });

    test("with JavaDouble instance, should return JavaDoubleMarshaller instance", () => {
      const input = new JavaDouble("1.1");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaDoubleMarshaller());
    });

    test("with JavaFloat instance, should return JavaFloatMarshaller instance", () => {
      const input = new JavaFloat("1.1");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaFloatMarshaller());
    });

    test("with JavaInteger instance, should return JavaIntegerMarshaller instance", () => {
      const input = new JavaInteger("1");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaIntegerMarshaller());
    });

    test("with JavaLong instance, should return JavaLongMarshaller instance", () => {
      const input = new JavaLong("1");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaLongMarshaller());
    });

    test("with JavaShort instance, should return JavaShortMarshaller instance", () => {
      const input = new JavaShort("1");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaShortMarshaller());
    });

    test("with JavaBoolean instance, should return JavaBooleanMarshaller instance", () => {
      const input = new JavaBoolean(false);
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaBooleanMarshaller());
    });

    test("with JavaString instance, should return JavaStringMarshaller instance", () => {
      const input = new JavaString("foo");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaStringMarshaller());
    });

    test("with JavaDate instance, should return JavaDateMarshaller instance", () => {
      const input = new JavaDate(new Date());
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaDateMarshaller());
    });

    test("with JavaBigDecimal instance, should return JavaBigDecimalMarshaller instance", () => {
      const input = new JavaBigDecimal("1.1");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaBigDecimalMarshaller());
    });

    test("with JavaBigInteger instance, should return JavaBigIntegerMarshaller instance", () => {
      const input = new JavaBigInteger("1");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaBigIntegerMarshaller());
    });

    test("with JavaArrayList instance, should return JavaArrayListMarshaller instance", () => {
      const input = new JavaArrayList([1, 2, 3]);
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaCollectionMarshaller.JavaArrayListMarshaller());
    });

    test("with JavaHashSet instance, should return JavaHashSetMarshaller instance", () => {
      const input = new JavaHashSet(new Set([1, 2, 3]));
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaCollectionMarshaller.JavaHashSetMarshaller());
    });

    test("with JavaHashMap instance, should return JavaHashMapMarshaller instance", () => {
      const input = new JavaHashMap(new Map([["foo", "bar"]]));
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaHashMapMarshaller());
    });

    test("with JavaOptional instance, should return JavaOptionalMarshaller instance", () => {
      const input = new JavaOptional<string>("str");
      expect(MarshallerProvider.getFor(input)).toEqual(new JavaOptionalMarshaller());
    });

    test("with input without fqcn, should return default marshaller", () => {
      const input = {
        foo: "bar",
        bar: "foo"
      };

      expect(MarshallerProvider.getFor(input)).toEqual(new DefaultMarshaller());
    });

    test("with input with a custom fqcn, should return default marshaller", () => {
      const fqcn = "com.myapp.custom.pojo";
      const input = {
        _fqcn: fqcn,
        foo: "bar",
        bar: "foo"
      };

      // it is a custom pojo (i.e. no pre-defined marshaller)
      expect(JavaWrapperUtils.isJavaType(fqcn)).toBeFalsy();

      expect(MarshallerProvider.getFor(input)).toEqual(new DefaultMarshaller());
    });

    test("with a Java type without marshaller, should throw error", () => {
      // the only scenario it throws errors is when a Java-wrapped type has no marshaller associated.

      // little trick to mess with internal state
      const marshallers = (MarshallerProvider as any).marshallersByJavaType;
      marshallers.delete(JavaType.STRING);

      const input = new JavaString("foo");

      expect(() => MarshallerProvider.getFor(input)).toThrowError();
    });

    test("all Java types should have a marshaller associated", () => {
      // this test is important to avoid developers to forget to add marshallers to new JavaTypes

      const marshallers = (MarshallerProvider as any).marshallersByJavaType;
      Object.keys(JavaType)
        .map((k: keyof typeof JavaType) => JavaType[k])
        .forEach(javaType => expect(marshallers.get(javaType)).toBeDefined());
    });
  });
});
