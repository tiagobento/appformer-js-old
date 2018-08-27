import { Portable } from "appformer/remote/";
import * as Marshalling from "appformer/remote/Marshalling";
import { ErraiBusObjectParts } from "appformer/remote/model/ErraiBusObject";

describe("__toErraiObject", () => {
  const encodedType = ErraiBusObjectParts.ENCODED_TYPE;
  const objectId = ErraiBusObjectParts.OBJECT_ID;

  let noAddrPerson: Person;
  let addr1: Address;

  beforeEach(() => {
    addr1 = new Address({
      line1: "aaaa",
      line2: "bbbb"
    });

    noAddrPerson = new Person({
      name: "bar"
    });
  });

  test("keep original input fields after conversion, including control fields", () => {
    const input = new Person({
      name: "foo",
      homeAddr: addr1,
      bestFriend: noAddrPerson
    });

    const output = JSON.parse(JSON.stringify(Marshalling.toErraiBusObject(input)));

    expect(output).toStrictEqual({
      [encodedType]: "org.appformer-js.test.Person",
      [objectId]: expect.anything(),
      name: "foo",
      homeAddr: {
        [encodedType]: "org.appformer-js.test.Address",
        [objectId]: expect.anything(),
        line1: "aaaa",
        line2: "bbbb"
      },
      bestFriend: {
        [encodedType]: "org.appformer-js.test.Person",
        [objectId]: expect.anything(),
        name: "bar"
      }
    });
  });

  test("assign an objectId only for non-primitive types and use different objectIds for different objects", () => {
    const input = new Person({
      name: "foo",
      homeAddr: addr1,
      bestFriend: noAddrPerson
    });

    // === test
    const output = JSON.parse(JSON.stringify(Marshalling.toErraiBusObject(input)));

    // === assertion
    const nonPrimitiveTypesObjId = [output[objectId], output.homeAddr[objectId], output.bestFriend[objectId]];

    const allObjIds = [
      output.name[objectId],
      output.homeAddr.line1[objectId],
      output.homeAddr.line2[objectId],
      output.bestFriend.name[objectId],
      ...nonPrimitiveTypesObjId
    ];

    const definedObjIds = allObjIds.filter(t => t !== undefined);

    // === only the non-primitive types should have an id and it should be unique
    expect(definedObjIds).toStrictEqual(nonPrimitiveTypesObjId);
    expect(Array.from(new Set(definedObjIds))).toStrictEqual(definedObjIds);
  });

  test("reuse the same objectId when objects are equals", () => {
    const anotherLine1 = addr1.line1 + "a"; // ensure different obj
    const anotherAddr = new Address({ line1: anotherLine1, line2: "fdgfg" });

    const input = new Person({
      name: "foo",
      homeAddr: addr1,
      workAddr: addr1, // same Address object
      bestFriend: new Person({
        name: "ypjomh",
        homeAddr: anotherAddr // different Address object
      })
    });

    // == test

    const output = JSON.parse(JSON.stringify(Marshalling.toErraiBusObject(input)));

    // == assertion

    // objectId of the objects that weren't shared
    const uniqueObjIds = [output[objectId], output.bestFriend[objectId], output.bestFriend.homeAddr[objectId]];

    const fooHomeAddrObjId = output.homeAddr[objectId];
    const fooWorkAddrObjId = output.workAddr[objectId];

    expect(fooHomeAddrObjId).toEqual(fooWorkAddrObjId); // same object, then same objId
    expect(uniqueObjIds).not.toContain(fooHomeAddrObjId); // different than any other objId

    // when reusing an existent object, do not include the data fields to optimize the output size
    expect(output.workAddr.line1).toBeUndefined();
    expect(output.workAddr.line2).toBeUndefined();
  });
});

// ==============
// ==============
// ============== fixture classes

class Person implements Portable {
  private readonly _fqcn = class {
    public static readonly value: () => string = () => {
      return "org.appformer-js.test.Person";
    };
  };

  public name: string;
  public homeAddr?: Address;
  public workAddr?: Address;
  public bestFriend?: Person;

  constructor(self: { name: string; homeAddr?: Address; workAddr?: Address; bestFriend?: Person }) {
    Object.assign(this, self);
  }
}

class Address implements Portable {
  private readonly _fqcn = class {
    public static readonly value: () => string = () => {
      return "org.appformer-js.test.Address";
    };
  };

  public line1: string;
  public line2: string;

  constructor(self: { line1: string; line2: string }) {
    Object.assign(this, self);
  }
}
