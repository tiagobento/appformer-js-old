import { ErraiBusObjectParts, Portable } from "appformer/remote/";

describe("__toErraiObject", () => {
  let input: ComplexTypesClass;

  const encodedType = ErraiBusObjectParts.ENCODED_TYPE;
  const objectId = ErraiBusObjectParts.OBJECT_ID;

  beforeEach(() => {
    input = new ComplexTypesClass({
      simpleField: "bla",
      complexField: new PrimitiveTypesClass({ strVar: "foo1", numbVar: 1 }),
      recursiveField: new ComplexTypesClass({
        simpleField: "ble",
        complexField: new PrimitiveTypesClass({ strVar: "foo2", numbVar: 2 })
      })
    });
  });

  test("keep original fields and wrap with control fields", () => {
    const erraiBusObject = JSON.parse(JSON.stringify(input.__toErraiBusObject()));

    expect(erraiBusObject).toStrictEqual({
      [encodedType]: "org.appformer-js.test.ComplexTypesClass",
      [objectId]: expect.anything(),
      simpleField: "bla",
      complexField: {
        [encodedType]: "org.appformer-js.test.PrimitiveTypesClass",
        [objectId]: expect.anything(),
        strVar: "foo1",
        numbVar: 1
      },
      recursiveField: {
        [encodedType]: "org.appformer-js.test.ComplexTypesClass",
        [objectId]: expect.anything(),
        simpleField: "ble",
        complexField: {
          [encodedType]: "org.appformer-js.test.PrimitiveTypesClass",
          [objectId]: expect.anything(),
          strVar: "foo2",
          numbVar: 2
        }
      }
    });
  });

  test("assign a different objectID when objects are different and reuse when objects are equals", () => {
    // TODO
    expect(1).toBe(1);
  });
});

// ==============
// ==============
// ============== fixture classes

class PrimitiveTypesClass extends Portable<PrimitiveTypesClass> {
  public strVar: string;
  public numbVar: number;

  constructor(self: { strVar: string; numbVar: number }) {
    super(self, "org.appformer-js.test.PrimitiveTypesClass");
  }
}

class ComplexTypesClass extends Portable<ComplexTypesClass> {
  public simpleField: string;
  public complexField: PrimitiveTypesClass;
  public recursiveField?: ComplexTypesClass;

  constructor(self: { simpleField: string; complexField: PrimitiveTypesClass; recursiveField?: ComplexTypesClass }) {
    super(self, "org.appformer-js.test.ComplexTypesClass");
  }
}
