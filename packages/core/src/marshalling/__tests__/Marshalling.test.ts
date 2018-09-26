import { MarshallerProvider } from "../MarshallerProvider";
import * as Marshalling from "../Marshalling";
import { JavaHashMap, JavaHashSet, JavaInteger, JavaLong, JavaOptional } from "../../java-wrappers";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";
import { Portable } from "../../internal";

describe("marshall", () => {
  test("with regular input, should return an errai object json-string version of it", () => {
    const input = new JavaInteger("1");
    const inputErraiObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: "java.lang.Integer",
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: 1
    };

    const expectedJson = JSON.stringify(inputErraiObject);

    const originalGetFor = MarshallerProvider.getForObject;

    // skip actual marshaller implementation
    const mockedMarshaller = { marshall: jest.fn(() => inputErraiObject) };
    MarshallerProvider.getForObject = jest.fn(() => mockedMarshaller);

    // ==
    // ====== test
    const output = Marshalling.marshall(input);

    // == assertion
    expect(expectedJson).toEqual(output);

    // reset static function, otherwise other tests will be invoking the function set by this test
    MarshallerProvider.getForObject = originalGetFor;
  });

  test("with null input, should return null", () => {
    const input = null as any;

    const output = Marshalling.marshall(input);

    expect(output).toBeNull();
  });

  test("with undefined input, should serialize marshaller output", () => {
    const input = undefined as any;

    const output = Marshalling.marshall(input);

    expect(output).toBeNull();
  });
});

describe.skip("unmarshall", () => {
  test("with custom portable, should create a correct instance", () => {
    MarshallerProvider.initialize();

    const json = `
    {
      "${ErraiObjectConstants.ENCODED_TYPE}": "com.app.my.Portable",
      "${ErraiObjectConstants.OBJECT_ID}": "1",
      "_foo": 1,
      "_foo2": 2,
      "_foo3": {
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Long",
        "${ErraiObjectConstants.OBJECT_ID}": "-1",
        "${ErraiObjectConstants.NUM_VAL}": "3"
      },
      "_foo4": "bar",
      "_foo5": {
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.Optional",
        "${ErraiObjectConstants.OBJECT_ID}": "-1",
        "${ErraiObjectConstants.VALUE}": "bar"
      },
      "_foo6": {
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.Optional",
        "${ErraiObjectConstants.OBJECT_ID}": "-1",
        "${ErraiObjectConstants.VALUE}": {
          "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Integer",
          "${ErraiObjectConstants.OBJECT_ID}": "-1",
          "${ErraiObjectConstants.NUM_VAL}": 6
        }
      },
      "_foo7": {
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.ArrayList",
        "${ErraiObjectConstants.OBJECT_ID}": "5",
        "${ErraiObjectConstants.VALUE}": [{
          "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Boolean",
          "${ErraiObjectConstants.OBJECT_ID}": "-1",
          "${ErraiObjectConstants.NUM_VAL}": true
        },{
          "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Boolean",
          "${ErraiObjectConstants.OBJECT_ID}": "-1",
          "${ErraiObjectConstants.NUM_VAL}": false
        }]
      },
      "_foo8": {
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.ArrayList",
        "${ErraiObjectConstants.OBJECT_ID}": "5"
      },
      "_foo9": {
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.HashSet",
        "${ErraiObjectConstants.OBJECT_ID}": "6",
        "${ErraiObjectConstants.VALUE}": [{
          "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Boolean",
          "${ErraiObjectConstants.OBJECT_ID}": "-1",
          "${ErraiObjectConstants.NUM_VAL}": true
        },{
          "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Boolean",
          "${ErraiObjectConstants.OBJECT_ID}": "-1",
          "${ErraiObjectConstants.NUM_VAL}": false
        }]
      },
      "_foo10": {
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.HashSet",
        "${ErraiObjectConstants.OBJECT_ID}": "6"
      },
      "_foo11": {
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.HashMap",
        "${ErraiObjectConstants.OBJECT_ID}": "7",
        "${ErraiObjectConstants.VALUE}": {
          "k1": {
            "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Integer",
            "${ErraiObjectConstants.OBJECT_ID}": "-1",
            "${ErraiObjectConstants.NUM_VAL}": 1
          },
          "k2": {
            "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Integer",
            "${ErraiObjectConstants.OBJECT_ID}": "-1",
            "${ErraiObjectConstants.NUM_VAL}": 2
          }
        }
      },
      "_foo12": {
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.HashMap",
        "${ErraiObjectConstants.OBJECT_ID}": "8",
        "${ErraiObjectConstants.VALUE}": {
          "k1": {
            "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Integer",
            "${ErraiObjectConstants.OBJECT_ID}": "-1",
            "${ErraiObjectConstants.NUM_VAL}": 1
          },
          "k2": {
            "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Integer",
            "${ErraiObjectConstants.OBJECT_ID}": "-1",
            "${ErraiObjectConstants.NUM_VAL}": 2
          }
        }
      }
    }
    `;

    const oracle = {
      "com.app.my.Portable": (data: any) => new MyPortable(data)
    };

    const output = Marshalling.unmarshall(json, oracle);

    const arr = [true, false];
    const st = new Set(arr);
    expect(output).toBeInstanceOf(MyPortable);
    expect(output).toEqual({
      _fqcn: "com.app.my.Portable",
      _foo: new JavaInteger("1"),
      _foo2: new JavaInteger("2"),
      _foo3: new JavaLong("3"),
      _foo4: "bar",
      _foo5: new JavaOptional("bar"),
      _foo6: new JavaOptional(new JavaInteger("6")),
      _foo7: arr,
      _foo8: arr,
      _foo9: st,
      _foo10: new JavaHashSet(st),
      _foo11: new Map([["k1", new JavaInteger("1")], ["k2", new JavaInteger("2")]]),
      _foo12: new JavaHashMap(new Map([["k1", new JavaInteger("1")], ["k2", new JavaInteger("2")]]))
    });
  });

  test("root string value", () => {
    MarshallerProvider.initialize();

    const json = `"foo"`;

    const output = Marshalling.unmarshall(json, {});

    expect(output).toEqual("foo");
  });

  test("root null value", () => {
    MarshallerProvider.initialize();

    const json = null as any;

    const output = Marshalling.unmarshall(json, {});

    expect(output).toEqual(null);
  });

  test("root java values", () => {
    MarshallerProvider.initialize();

    const json = `{
      "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Long",
      "${ErraiObjectConstants.OBJECT_ID}": "-1",
      "${ErraiObjectConstants.NUM_VAL}": "3"
    }`;

    const output = Marshalling.unmarshall(json, {});

    expect(output).toEqual(new JavaLong("3"));
  });

  test("root array", () => {
    MarshallerProvider.initialize();

    const json = `{
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.ArrayList",
        "${ErraiObjectConstants.OBJECT_ID}": "5",
        "${ErraiObjectConstants.VALUE}": [{
          "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Boolean",
          "${ErraiObjectConstants.OBJECT_ID}": "-1",
          "${ErraiObjectConstants.NUM_VAL}": true
        },{
          "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Boolean",
          "${ErraiObjectConstants.OBJECT_ID}": "-1",
          "${ErraiObjectConstants.NUM_VAL}": false
        }]
      }`;

    const output = Marshalling.unmarshall(json, {});

    expect(output).toEqual([true, false]);
  });

  test("root set", () => {
    MarshallerProvider.initialize();

    const json = `{
        "${ErraiObjectConstants.ENCODED_TYPE}": "java.util.HashSet",
        "${ErraiObjectConstants.OBJECT_ID}": "5",
        "${ErraiObjectConstants.VALUE}": [{
          "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Boolean",
          "${ErraiObjectConstants.OBJECT_ID}": "-1",
          "${ErraiObjectConstants.NUM_VAL}": true
        },{
          "${ErraiObjectConstants.ENCODED_TYPE}": "java.lang.Boolean",
          "${ErraiObjectConstants.OBJECT_ID}": "-1",
          "${ErraiObjectConstants.NUM_VAL}": false
        }]
      }`;

    const output = Marshalling.unmarshall(json, {});

    expect(output).toEqual(new Set([true, false]));
  });

  class MyPortable implements Portable<MyPortable> {
    private readonly _fqcn = "com.app.my.Portable";

    private _foo?: JavaInteger = new JavaInteger("0");
    private _foo2?: JavaInteger = new JavaInteger("0");
    private _foo3?: JavaLong = new JavaLong("0");
    private _foo4?: string;
    private _foo5?: JavaOptional<string>;
    private _foo6?: JavaOptional<JavaInteger>;
    private _foo7?: boolean[];
    private _foo8?: boolean[];
    private _foo9?: Set<boolean>;
    private _foo10?: JavaHashSet<boolean> = new JavaHashSet(new Set());
    private _foo11?: Map<string, JavaInteger>;
    private _foo12?: JavaHashMap<string, JavaInteger> = new JavaHashMap(new Map());

    constructor(self: {
      _foo: JavaInteger;
      _foo2: JavaInteger;
      _foo3: JavaLong;
      _foo4: string;
      _foo5: JavaOptional<string>;
      _foo6: JavaOptional<JavaInteger>;
      _foo7: boolean[];
      _foo8: boolean[];
      _foo9?: Set<boolean>;
      _foo10?: JavaHashSet<boolean>;
      _foo11?: Map<string, JavaInteger>;
      _foo12?: JavaHashMap<string, JavaInteger>;
    }) {
      Object.assign(this, self);
    }

    public foo(): JavaInteger | undefined {
      return this._foo;
    }

    public foo2(): JavaInteger | undefined {
      return this._foo2;
    }

    public foo3(): JavaLong | undefined {
      return this._foo3;
    }

    public foo4(): string | undefined {
      return this._foo4;
    }

    public foo5(): JavaOptional<string> | undefined {
      return this._foo5;
    }

    public foo6(): JavaOptional<JavaInteger> | undefined {
      return this._foo6;
    }

    public foo7(): boolean[] | undefined {
      return this._foo7;
    }

    public foo8(): boolean[] | undefined {
      return this._foo8;
    }

    public foo9(): Set<boolean> | undefined {
      return this._foo9;
    }

    public foo10(): JavaHashSet<boolean> | undefined {
      return this._foo10;
    }

    public foo11(): Map<string, JavaInteger> | undefined {
      return this._foo11;
    }

    public foo12(): JavaHashMap<string, JavaInteger> | undefined {
      return this._foo12;
    }
  }
});
