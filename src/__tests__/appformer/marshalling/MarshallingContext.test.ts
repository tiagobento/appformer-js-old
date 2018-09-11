import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import JavaWrapper from "appformer/java-wrappers/JavaWrapper";

describe("newObjectId", () => {
  test("with sequential calls, should return different ids", () => {
    const context = new MarshallingContext();

    const firstObjectId = context.newObjectId();
    const secondObjectId = context.newObjectId();

    expect(firstObjectId).not.toEqual(secondObjectId);
  });
});

describe("recordObject", () => {
  let context: MarshallingContext;

  beforeEach(() => {
    context = new MarshallingContext();
  });

  test("with regular object, should record the correct ErraiObject instance", () => {
    const inputPortable = { _fqcn: "com.myapp.my.portable", foo: "bar", bar: "foo" };

    const inputErraiObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1",
      [ErraiObjectConstants.NUM_VAL]: "123"
    } as ErraiObject;

    context.recordObject(inputPortable, inputErraiObject);

    // the only cached fields are the encodedType and objectId
    expect((context as any).objContext.get(inputPortable)).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1"
    });
  });

  test("with object overwritten, should return the last version", () => {
    const inputPortable = { _fqcn: "com.myapp.my.portable", foo: "bar", bar: "foo" };

    const inputErraiObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1",
      [ErraiObjectConstants.NUM_VAL]: "123"
    } as ErraiObject;

    context.recordObject(inputPortable, inputErraiObject);

    // override object
    context.recordObject(inputPortable, {
      ...inputErraiObject,
      [ErraiObjectConstants.OBJECT_ID]: "2"
    });

    expect((context as any).objContext.get(inputPortable)).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "2"
    });
  });

  test("with java wrapper object, should use the inner value as cache key", () => {
    const innerValue = 1;
    const wrappedValue = new MyNumberWrappedType(innerValue);

    const inputErraiObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1",
      [ErraiObjectConstants.NUM_VAL]: "123"
    } as ErraiObject;

    context.recordObject(wrappedValue, inputErraiObject);

    // use the inner value object as cache key
    expect((context as any).objContext.get(innerValue)).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1"
    });

    // do not use the wrapped object as cache key
    expect((context as any).objContext.get(wrappedValue)).toBeUndefined();
  });
});

describe("getObject", () => {
  let context: MarshallingContext;

  beforeEach(() => {
    context = new MarshallingContext();
  });

  test("with non-existent key, should return undefined", () => {
    const input = { _fqcn: "com.myapp.my.portable", foo: "bar", bar: "foo" };
    expect(context.getObject(input)).toBeUndefined();
  });

  test("with existent key, should same object recorded previously", () => {
    const inputPortable = { _fqcn: "com.myapp.my.portable", foo: "bar", bar: "foo" };
    const inputErraiObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1"
    } as ErraiObject;

    (context as any).objContext.set(inputPortable, inputErraiObject);

    expect(context.getObject(inputPortable)).toStrictEqual(inputErraiObject);
  });

  test("with java wrapper object, should use the inner value as cache key", () => {
    const innerValue = 1;
    const wrappedValue = new MyNumberWrappedType(innerValue);

    const inputErraiObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1"
    } as ErraiObject;

    (context as any).objContext.set(innerValue, inputErraiObject);

    // use the inner value object as cache key
    expect(context.getObject(innerValue)).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1"
    });

    expect(context.getObject(wrappedValue)).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1"
    });
  });
});

class MyNumberWrappedType extends JavaWrapper<number> {
  private readonly _fqcn = "com.type.wrapped.number.my";

  private readonly _value: number;

  constructor(value: number) {
    super();
    this._value = value;
  }

  public get(): number {
    return this._value;
  }
}
