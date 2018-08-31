import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import JavaWrapper from "appformer/java-wrapper/JavaWrapper";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import Marshaller from "appformer/marshalling/Marshaller";

export default class DefaultMarshaller implements Marshaller<any, ErraiObject> {
  public marshall(input: any, ctx: MarshallingContext): ErraiObject {
    const cachedObject = ctx.getObject(input);
    if (cachedObject) {
      return cachedObject;
    }

    const rootFqcn = (input as any)._fqcn;
    if (!rootFqcn) {
      // convert native JS types to a default Java type implementation
      if (JavaWrapper.needsWrapping(input)) {
        return this.marshallWrappableType(input, ctx);
      }
    }

    if (JavaWrapper.isJavaType(rootFqcn)) {
      const marshaller = MarshallerProvider.getFor(input);
      return marshaller.marshall(input, ctx);
    }

    const _this = this.marshallCustomObject(input, ctx, rootFqcn);

    ctx.recordObject(input, _this);

    return _this;
  }

  private marshallCustomObject(input: any, ctx: MarshallingContext, fqcn: string) {
    const _this = { ...(input as any) };

    Object.keys(_this).forEach(k => {
      if (typeof _this[k] === "function") {
        delete _this[k];
      } else if (!_this[k]) {
        _this[k] = null;
      } else if (_this[k] && _this[k]._fqcn) {
        const marshaller = MarshallerProvider.getFor(_this[k]);
        _this[k] = marshaller.marshall(_this[k], ctx);
      } else {
        if (JavaWrapper.needsWrapping(_this[k])) {
          return this.marshallWrappableType(_this[k], ctx);
        }

        // nothing to do, will marshall field as is
      }
    });

    _this[ErraiObjectConstants.ENCODED_TYPE] = fqcn;
    _this[ErraiObjectConstants.OBJECT_ID] = `${ctx.newObjectId()}`;
    delete _this._fqcn;
    return _this;
  }

  private marshallWrappableType(input: any, ctx: MarshallingContext): any {
    // convert native JS types to a default Java type implementation
    const wrappedType = JavaWrapper.wrapIfNeeded(input);

    return MarshallerProvider.getFor(wrappedType).marshall(wrappedType, ctx);
  }
}
