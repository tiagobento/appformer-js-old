import { JavaCollection } from "../../java-wrappers/JavaCollection";
import { ErraiObject } from "../model/ErraiObject";
import { MarshallingContext } from "../MarshallingContext";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";
import { Portable } from "../../internal/model/Portable";
import { NullableMarshaller } from "./NullableMarshaller";
import { GenericsTypeMarshallingUtils } from "./util/GenericsTypeMarshallingUtils";
import { UnmarshallingContext } from "../UnmarshallingContext";
import { isArray } from "../../util/TypeUtils";
import { JavaArrayList, JavaHashSet } from "../../java-wrappers";

abstract class JavaCollectionMarshaller<T extends Iterable<Portable<any> | null>> extends NullableMarshaller<
  JavaCollection<T>,
  ErraiObject,
  ErraiObject,
  T
> {
  public notNullMarshall(input: JavaCollection<T>, ctx: MarshallingContext): ErraiObject {
    const cachedObject = ctx.getCached(input);
    if (cachedObject) {
      return cachedObject;
    }

    const elements = input.get();

    const serializedValues = [];
    for (const element of Array.from(elements)) {
      serializedValues.push(GenericsTypeMarshallingUtils.marshallGenericsTypeElement(element, ctx));
    }

    const resultObject = {
      [ErraiObjectConstants.ENCODED_TYPE]: (input as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: `${ctx.incrementAndGetObjectId()}`,
      [ErraiObjectConstants.VALUE]: serializedValues
    };

    ctx.cacheObject(input, resultObject);

    return resultObject;
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): T {
    const cachedObject = ctx.getCached(input);
    if (cachedObject) {
      return (cachedObject as JavaCollection<T>).get();
    }

    const collection = input[ErraiObjectConstants.VALUE];
    if (!collection) {
      return null as any;
    }

    if (!isArray(collection)) {
      // inside the json, all collections are represented as an array
      throw new Error(`Invalid collection value ${collection}. Can't unmarshall json ${input}`);
    }

    const unmarshalledValues = [];
    for (const element of Array.from(collection)) {
      unmarshalledValues.push(GenericsTypeMarshallingUtils.unmarshallGenericsTypeElement(element, ctx));
    }

    const javaCollection = this.fromArray(unmarshalledValues);
    ctx.cacheObject(input, javaCollection);

    return javaCollection.get();
  }

  protected abstract fromArray(values: Array<Portable<any>>): JavaCollection<T>;
}

export class JavaArrayListMarshaller extends JavaCollectionMarshaller<Array<Portable<any> | null>> {
  protected fromArray(values: Array<Portable<any>>): JavaArrayList<Portable<any>> {
    return new JavaArrayList(values);
  }
}

export class JavaHashSetMarshaller extends JavaCollectionMarshaller<Set<Portable<any> | null>> {
  protected fromArray(values: Array<Portable<any>>): JavaHashSet<Portable<any>> {
    return new JavaHashSet(new Set(values));
  }
}
