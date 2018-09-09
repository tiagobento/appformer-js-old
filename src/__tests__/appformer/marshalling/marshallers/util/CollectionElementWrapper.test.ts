import JavaArrayList from "appformer/java-wrappers/JavaArrayList";
import CollectionElementWrapper from "appformer/marshalling/marshallers/util/CollectionElementWrapper";
import JavaHashSet from "appformer/java-wrappers/JavaHashSet";
import JavaBigDecimal from "appformer/java-wrappers/JavaBigDecimal";
import JavaBigInteger from "appformer/java-wrappers/JavaBigInteger";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import JavaByte from "appformer/java-wrappers/JavaByte";
import JavaDouble from "appformer/java-wrappers/JavaDouble";
import JavaFloat from "appformer/java-wrappers/JavaFloat";
import JavaHashMap from "appformer/java-wrappers/JavaHashMap";
import JavaInteger from "appformer/java-wrappers/JavaInteger";
import JavaLong from "appformer/java-wrappers/JavaLong";
import JavaShort from "appformer/java-wrappers/JavaShort";
import JavaString from "appformer/java-wrappers/JavaString";
import Portable from "appformer/internal/model/Portable";
import JavaDate from "appformer/java-wrappers/JavaDate";

describe("shouldWrapWhenInsideCollection", () => {
  test("with JavaArrayList input, should return false", () => {
    const input = new JavaArrayList(["str1", "str2"]);

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeFalsy();
  });

  test("with JavaBigDecimal input, should return false", () => {
    const input = new JavaBigDecimal("1.1");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeFalsy();
  });

  test("with JavaBigInteger input, should return false", () => {
    const input = new JavaBigInteger("1");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeFalsy();
  });

  test("with JavaBoolean input, should return true", () => {
    const input = new JavaBoolean(false);

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeTruthy();
  });

  test("with JavaByte input, should return true", () => {
    const input = new JavaByte("1");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeTruthy();
  });

  test("with JavaDouble input, should return true", () => {
    const input = new JavaDouble("1.1");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeTruthy();
  });

  test("with JavaFloat input, should return true", () => {
    const input = new JavaFloat("1.1");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeTruthy();
  });

  test("with JavaHashMap input, should return false", () => {
    const input = new JavaHashMap(new Map([["foo1", "bar1"], ["foo2", "bar2"]]));

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeFalsy();
  });

  test("with JavaHashSet input, should return false", () => {
    const input = new JavaHashSet(new Set(["str1", "str2"]));

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeFalsy();
  });

  test("with JavaInteger input, should return true", () => {
    const input = new JavaInteger("1");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeTruthy();
  });

  test("with JavaLong input, should return false", () => {
    const input = new JavaLong("1");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeFalsy();
  });

  test("with JavaShort input, should return true", () => {
    const input = new JavaShort("1");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeTruthy();
  });

  test("with JavaString input, should return false", () => {
    const input = new JavaString("str");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeFalsy();
  });

  test("with JavaDate input, should return false", () => {
    const input = new JavaDate(new Date());

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeFalsy();
  });

  test("with custom portable input, should return false", () => {
    const input = new Pojo("bar");

    const output = CollectionElementWrapper.shouldWrapWhenInsideCollection(input);

    expect(output).toBeFalsy();
  });

  class Pojo implements Portable<Pojo> {
    private readonly _fqcn = "com.app.my.Pojo";

    public foo: string;

    constructor(foo: string) {
      this.foo = foo;
    }
  }
});
