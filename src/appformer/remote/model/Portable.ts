export enum ErraiBusObjectParts {
  ENCODED_TYPE = "^EncodedType",
  OBJECT_ID = "^ObjectID"
}

export interface ErraiBusObject {
  [ErraiBusObjectParts.ENCODED_TYPE]: string;
  [ErraiBusObjectParts.OBJECT_ID]: string;

  __toJson(): string;
}

export class Portable<T extends Portable<T>> {
  public readonly __fqcn: string;

  constructor(self: any, fqcn: string) {
    if (self) {
      self.__fqcn = fqcn;
      Object.assign(this, self);
    }
  }

  public readonly __toErraiBusObject: (() => T & ErraiBusObject) = () => {
    return this.__internalToErraiBusObject();
  };

  private __internalToErraiBusObject(ctx = new Map(), currObjID = 1): T & ErraiBusObject {
    if (ctx.get(this) !== undefined) {
      return ctx.get(this);
    }

    const _this = { ...(this as any) };

    Object.keys(_this).forEach(k => {
      if (typeof _this[k] === "function") {
        delete _this[k];
      } else if (_this[k] && _this[k].__fqcn) {
        _this[k] = _this[k].__internalToErraiBusObject(ctx, currObjID++);
      } else if (!_this[k]) {
        _this[k] = null;
      }
    });

    _this[ErraiBusObjectParts.ENCODED_TYPE] = _this.__fqcn;
    _this[ErraiBusObjectParts.OBJECT_ID] = `${currObjID}`;
    delete _this.__fqcn;

    const finalBusObject = {
      ..._this,
      __toJson() {
        return JSON.stringify(this);
      }
    };

    this.cacheBusObject(ctx, finalBusObject);

    return finalBusObject;
  }

  private cacheBusObject(ctx: Map<Portable<T>, ErraiBusObject>, obj: T & ErraiBusObject) {
    ctx.set(this, {
      [ErraiBusObjectParts.ENCODED_TYPE]: obj[ErraiBusObjectParts.ENCODED_TYPE],
      [ErraiBusObjectParts.OBJECT_ID]: obj[ErraiBusObjectParts.OBJECT_ID],
      __toJson: obj.__toJson
    });
  }
}
