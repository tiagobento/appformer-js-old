import JavaNumber from "appformer/java-wrappers/JavaNumber";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import Portable from "appformer/internal/model/Portable";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import ErraiObject from "appformer/marshalling/model/ErraiObject";

export default class CollectionElementWrapper {
  public static shouldWrapWhenInsideCollection(value: Portable<any>) {
    return value instanceof JavaNumber || value instanceof JavaBoolean;
  }

  public static erraiObjectFromCollectionInnerElement(
    value: Portable<any>,
    marshaledValue: any
  ): ErraiObject | undefined {
    // This is mandatory in order to comply with errai-marshalling protocol.
    // When it founds a number inside a collection, the number is wrapped
    // inside a ErraiObject envelope

    if (!this.shouldWrapWhenInsideCollection(value)) {
      return undefined;
    }

    return {
      [ErraiObjectConstants.ENCODED_TYPE]: (value as any)._fqcn,
      [ErraiObjectConstants.OBJECT_ID]: "-1",
      [ErraiObjectConstants.NUM_VAL]: marshaledValue
    };
  }
}
