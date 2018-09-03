import ErraiObject from "appformer/marshalling/model/ErraiObject";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import Portable from "appformer/internal/model/Portable";

export default class MarshallingContext {
  private objContext: Map<Portable<any>, ErraiObject>;
  private objectId: number;

  constructor() {
    this.objContext = new Map();
    this.objectId = 0;
  }

  public newObjectId() {
    return ++this.objectId;
  }

  public recordObject(key: Portable<any>, obj: ErraiObject) {
    this.objContext.set(key, {
      [ErraiObjectConstants.ENCODED_TYPE]: obj[ErraiObjectConstants.ENCODED_TYPE],
      [ErraiObjectConstants.OBJECT_ID]: obj[ErraiObjectConstants.OBJECT_ID]
    });
  }

  public getObject(key: Portable<any>): ErraiObject | undefined {
    return this.objContext.get(key)!;
  }
}
