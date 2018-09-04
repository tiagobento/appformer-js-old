import MarshallingContext from "appformer/marshalling/MarshallingContext";
import Portable from "appformer/internal/model/Portable";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";

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
    const inputPortable = new MyPortable({ foo: "bar", bar: "foo" });
    const inputErraiObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1",
      [ErraiObjectConstants.NUM_VAL]: "123"
    } as ErraiObject;

    context.recordObject(inputPortable, inputErraiObject);

    // the only cached fields are the encodedType and objectId
    expect(context.getObject(inputPortable)).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1"
    });
  });

  test("with object overwritten, should return the last version", () => {
    const inputPortable = new MyPortable({ foo: "bar", bar: "foo" });
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

    expect(context.getObject(inputPortable)).toStrictEqual({
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "2"
    });
  });
});

describe("getObject", () => {
  let context: MarshallingContext;

  beforeEach(() => {
    context = new MarshallingContext();
  });

  test("with non-existent key, should return undefined", () => {
    const input = new MyPortable({ foo: "bar", bar: "foo" });
    expect(context.getObject(input)).toBeUndefined();
  });

  test("with existent key, should same object recorded previously", () => {
    const inputPortable = new MyPortable({ foo: "bar", bar: "foo" });
    const inputErraiObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: "com.foo.bar",
      [ErraiObjectConstants.OBJECT_ID]: "1"
    } as ErraiObject;

    context.recordObject(inputPortable, inputErraiObject);

    expect(context.getObject(inputPortable)).toStrictEqual(inputErraiObject);
  });
});

class MyPortable implements Portable<MyPortable> {
  private readonly _fqcn = "com.myapp.my.portable";

  private readonly foo: string;
  private readonly bar: string;

  constructor(self: { foo: string; bar: string }) {
    this.foo = self.foo;
    this.bar = self.bar;
  }
}
