import { Portable } from "./model/Portable";
import { ErraiBusObject, ErraiBusObjectParts } from "./model/ErraiBusObject";

export function marshall(obj: Portable | string) {
  return typeof obj !== "string" ? toErraiBusObject(obj).__toJson() : obj;
}

// TODO: Implement to return an object from the Model file
export function unmarshall(json: any) {
  return json;
}

export function toErraiBusObject(input: any, ctx = new Map(), currObjID = 1) {
  if (ctx.get(input) !== undefined) {
    return ctx.get(input);
  }

  const _this = { ...(input as any) };

  Object.keys(_this).forEach(k => {
    if (typeof _this[k] === "function") {
      delete _this[k];
    } else if (_this[k] && _this[k]._fqcn) {
      _this[k] = toErraiBusObject(_this[k], ctx, currObjID++);
    } else if (!_this[k]) {
      _this[k] = null;
    }
  });

  _this[ErraiBusObjectParts.ENCODED_TYPE] = _this._fqcn;
  _this[ErraiBusObjectParts.OBJECT_ID] = `${currObjID}`;
  delete _this._fqcn;

  const finalBusObject = {
    ..._this,
    __toJson() {
      return JSON.stringify(this);
    }
  };

  cacheBusObject(ctx, input, finalBusObject);

  return finalBusObject;
}

function cacheBusObject(ctx: Map<Portable, ErraiBusObject>, key: Portable, obj: ErraiBusObject) {
  ctx.set(key, {
    [ErraiBusObjectParts.ENCODED_TYPE]: obj[ErraiBusObjectParts.ENCODED_TYPE],
    [ErraiBusObjectParts.OBJECT_ID]: obj[ErraiBusObjectParts.OBJECT_ID],
    __toJson: obj.__toJson
  });
}
