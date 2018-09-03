import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import JavaWrapper from "appformer/java-wrapper/JavaWrapper";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import Marshaller from "appformer/marshalling/Marshaller";
import Portable from "appformer/internal/model/Portable";

export default class DefaultMarshaller<T extends Portable<T>> implements Marshaller<T, ErraiObject> {
  public marshall(input: T, ctx: MarshallingContext): ErraiObject {
    const cachedObject = ctx.getObject(input);
    if (cachedObject) {
      return cachedObject;
    }

    const rootFqcn = (input as any)._fqcn;
    if (!rootFqcn) {
      // the input may be of primitive type, if it is a Java-wrappable type,
      // we need to wrap it before marshalling
      if (JavaWrapper.needsWrapping(input)) {
        return DefaultMarshaller.marshallWrappableType(input, ctx);
      }
    }

    // Input has fqcn, so, it represents a Java type. We need to check if it
    // is a primitive Java type or not, because this marshaller handles only
    // custom types (i.e. Portable).

    if (JavaWrapper.isJavaType(rootFqcn)) {
      const marshaller = MarshallerProvider.getFor(input);
      const marshaledObject = marshaller.marshall(input, ctx);

      ctx.recordObject(input, marshaledObject);
      return marshaledObject;
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
          return DefaultMarshaller.marshallWrappableType(_this[k], ctx);
        }

        // nothing to do, will marshall field as is
      }
    });

    _this[ErraiObjectConstants.ENCODED_TYPE] = fqcn;
    _this[ErraiObjectConstants.OBJECT_ID] = `${ctx.newObjectId()}`;
    delete _this._fqcn;
    return _this;
  }

  private static marshallWrappableType(input: any, ctx: MarshallingContext): any {
    // convert native JS types to a default Java type implementation
    const wrappedType = JavaWrapper.wrapIfNeeded(input);

    return MarshallerProvider.getFor(wrappedType).marshall(wrappedType, ctx);
  }
}
