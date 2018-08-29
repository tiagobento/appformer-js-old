import { ErraiObject, ErraiObjectConstants } from "./model/ErraiObject";
import { JavaWrapper } from "../internal/model/numbers/JavaWrapper";
import { MarshallingContext } from "./MarshallingContext";
import { MarshallerProvider } from "./MarshallerProvider";

export class ErraiMarshaller {
  private _marshallerProvider: MarshallerProvider;

  constructor(self: { marshallerProvider: MarshallerProvider }) {
    this._marshallerProvider = self.marshallerProvider;
  }

  public marshall(input: any, ctx = new MarshallingContext()): ErraiObject {
    const cachedObject = ctx.getObject(input);
    if (cachedObject !== undefined) {
      return cachedObject;
    }

    const _this = { ...(input as any) };

    Object.keys(_this).forEach(k => {
      if (typeof _this[k] === "function") {
        delete _this[k];
      } else if (!_this[k]) {
        _this[k] = null;
      } else if (_this[k] && _this[k]._fqcn) {
        const fqcn = _this[k]._fqcn;
        if (JavaWrapper.isJavaType(fqcn)) {
          const marshaller = MarshallerProvider.getFor(fqcn);
          _this[k] = marshaller.marshall(_this[k], ctx);
        } else {
          _this[k] = this.marshall(_this[k], ctx);
        }
      } else {
        // convert native JS types to a default Java type implementation
        const wrappedType = JavaWrapper.wrapIfNeeded(_this[k]);
        if (wrappedType) {
          const marshaller = MarshallerProvider.getFor(_this[k]._fqcn);
          _this[k] = marshaller.marshall(wrappedType, ctx);
        }

        // nothing to do, will marshall field as is
      }
    });

    _this[ErraiObjectConstants.ENCODED_TYPE] = _this._fqcn;
    _this[ErraiObjectConstants.OBJECT_ID] = `${ctx.newObjectId()}`;
    delete _this._fqcn;

    ctx.recordObject(input, _this);

    return _this;
  }
}
