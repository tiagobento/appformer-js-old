import JavaWrapper from "appformer/java-wrappers/JavaWrapper";
import JavaArrayList from "appformer/java-wrappers/JavaArrayList";
import JavaHashSet from "appformer/java-wrappers/JavaHashSet";
import JavaHashMap from "appformer/java-wrappers/JavaHashMap";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import JavaString from "appformer/java-wrappers/JavaString";
import JavaDate from "appformer/java-wrappers/JavaDate";

describe("needsWrapping", () => {
  test("with array object, should return true", () => {
    const input = ["foo1", "foo2", "foo3"];
    expect(JavaWrapper.needsWrapping(input)).toBeTruthy();
  });

  test("with set object, should return true", () => {
    const input = new Set(["foo1", "foo2", "foo3"]);
    expect(JavaWrapper.needsWrapping(input)).toBeTruthy();
  });

  test("with map object, should return true", () => {
    const input = new Map([["foo1", "bar1"], ["foo2", "bar2"]]);
    expect(JavaWrapper.needsWrapping(input)).toBeTruthy();
  });

  test("with boolean object, should return true", () => {
    const input = false;
    expect(JavaWrapper.needsWrapping(input)).toBeTruthy();
  });

  test("with string object, should return true", () => {
    const input = "foo";
    expect(JavaWrapper.needsWrapping(input)).toBeTruthy();
  });

  test("with date object, should return true", () => {
    const input = new Date();
    expect(JavaWrapper.needsWrapping(input)).toBeTruthy();
  });

  test("with custom object, should return false", () => {
    const input = {
      foo: "bar1",
      foo2: "bar2"
    };
    expect(JavaWrapper.needsWrapping(input)).toBeFalsy();
  });
});

describe("wrapIfNeeded", () => {
  test("with array object, should return a JavaArray instance", () => {
    const input = ["foo1", "foo2", "foo3"];
    expect(JavaWrapper.wrapIfNeeded(input)).toEqual(new JavaArrayList(["foo1", "foo2", "foo3"]));
  });

  test("with set object, should return a JavaHashSet instance", () => {
    const input = new Set(["foo1", "foo2", "foo3"]);
    const output = new JavaHashSet(new Set(["foo1", "foo2", "foo3"]));
    expect(JavaWrapper.wrapIfNeeded(input)).toEqual(output);
  });

  test("with map object, should return a JavaHashMap instance", () => {
    const input = new Map([["foo1", "bar1"], ["foo2", "bar2"]]);
    const output = new JavaHashMap(new Map([["foo1", "bar1"], ["foo2", "bar2"]]));
    expect(JavaWrapper.wrapIfNeeded(input)).toEqual(output);
  });

  test("with boolean object, should return a JavaBoolean instance", () => {
    const input = false;
    const output = new JavaBoolean(false);
    expect(JavaWrapper.wrapIfNeeded(input)).toEqual(output);
  });

  test("with string object, should return a JavaString instance", () => {
    const input = "foo";
    const output = new JavaString("foo");
    expect(JavaWrapper.wrapIfNeeded(input)).toEqual(output);
  });

  test("with date object, should return a JavaDate instance", () => {
    const input = new Date();
    const output = new JavaDate(input);
    expect(JavaWrapper.wrapIfNeeded(input)).toEqual(output);
  });

  test("with custom object, should return undefined", () => {
    const input = {
      foo: "bar1",
      foo2: "bar2"
    };
    expect(JavaWrapper.wrapIfNeeded(input)).toBeUndefined();
  });
});

describe("isJavaType", () => {
  test("with Java Byte's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.lang.Byte")).toBeTruthy();
  });

  test("with Java Double's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.lang.Double")).toBeTruthy();
  });

  test("with Java Float's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.lang.Float")).toBeTruthy();
  });

  test("with Java Integer's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.lang.Integer")).toBeTruthy();
  });

  test("with Java Long's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.lang.Long")).toBeTruthy();
  });

  test("with Java Short's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.lang.Short")).toBeTruthy();
  });

  test("with Java Boolean's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.lang.Boolean")).toBeTruthy();
  });

  test("with Java String's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.lang.String")).toBeTruthy();
  });

  test("with Java BigDecimal's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.math.BigDecimal")).toBeTruthy();
  });

  test("with Java BigInteger's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.math.BigInteger")).toBeTruthy();
  });

  test("with Java ArrayList's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.util.ArrayList")).toBeTruthy();
  });

  test("with Java HashSet's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.util.HashSet")).toBeTruthy();
  });

  test("with Java HashMap's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.util.HashMap")).toBeTruthy();
  });

  test("with Java Date's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.util.Date")).toBeTruthy();
  });

  test("with non Java type fqcn, should return false", () => {
    expect(JavaWrapper.isJavaType("foo")).toBeFalsy();
  });

  test("with Java Optional's fqcn, should return true", () => {
    expect(JavaWrapper.isJavaType("java.util.Optional")).toBeTruthy();
  });
});
