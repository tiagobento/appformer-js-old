import { Portable } from "./Portable";
import { ErraiObject } from "./model/ErraiObject";
import { ErraiObjectConstants } from "./model/ErraiObjectConstants";

export class UnmarshallingContext {
  private readonly _oracle: Map<string, () => Portable<any>>;
  private readonly _objectsCache: Map<string, Portable<any>>;

  constructor(oracle: Map<string, () => Portable<any>>) {
    this._oracle = oracle;
    this._objectsCache = new Map();
  }

  public cacheObject(input: ErraiObject, obj: Portable<any>) {
    const objectId = input[ErraiObjectConstants.OBJECT_ID];
    if (objectId) {
      this._objectsCache.set(objectId, obj);
    }
  }

  public getCached(input: ErraiObject): Portable<any> | undefined {
    const objectId = input[ErraiObjectConstants.OBJECT_ID];
    if (!objectId) {
      return undefined;
    }

    return this._objectsCache.get(objectId);
  }

  public getFactory(fqcn: string): (() => Portable<any>) | undefined {
    return this._oracle.get(fqcn);
  }
}
