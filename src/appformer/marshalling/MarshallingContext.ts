import ErraiObject from "appformer/marshalling/model/ErraiObject";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import Portable from "appformer/internal/model/Portable";
import JavaWrapper from "appformer/java-wrappers/JavaWrapper";

export default class MarshallingContext {
  private objContext: Map<Portable<any>, ErraiObject>;
  private objectId: number;

  constructor() {
    this.objContext = new Map();
    this.objectId = 0;
  }

  public incrementAndGetObjectId() {
    return ++this.objectId;
  }

  public cacheObject(key: Portable<any>, obj: ErraiObject) {
    this.objContext.set(this.unwrap(key), {
      [ErraiObjectConstants.ENCODED_TYPE]: obj[ErraiObjectConstants.ENCODED_TYPE],
      [ErraiObjectConstants.OBJECT_ID]: obj[ErraiObjectConstants.OBJECT_ID]
    });
  }

  public getCached(key: Portable<any>): ErraiObject | undefined {
    return this.objContext.get(this.unwrap(key))!;
  }

  private unwrap(key: Portable<any>) {
    if (JavaWrapper.extendsJavaWrapper(key)) {
      // When handling wrapped values, we use the raw typescript value as cache key.
      // This is needed because in the marshalling flow we wrap the values automatically
      // if they represent a Java type, creating a new wrapper object every time. If we use the wrapper
      // object directly, the value will never be found in cache, because it'll always be a different pointer
      return key.get();
    }

    return key;
  }
}
