import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import MarshallingContext from "appformer/marshalling/MarshallingContext";
import ErraiObject from "appformer/marshalling/model/ErraiObject";
import JavaWrapperUtils from "appformer/java-wrappers/JavaWrapperUtils";
import ErraiObjectConstants from "appformer/marshalling/model/ErraiObjectConstants";
import Portable from "appformer/internal/model/Portable";
import NullableMarshaller from "appformer/marshalling/marshallers/NullableMarshaller";

export default class DefaultMarshaller<T extends Portable<T>> extends NullableMarshaller<T, ErraiObject> {
  public notNullMarshall(input: T, ctx: MarshallingContext): ErraiObject {
    const cachedObject = ctx.getObject(input);
    if (cachedObject) {
      return cachedObject;
    }

    const rootFqcn = (input as any)._fqcn;
    if (!rootFqcn) {
      // the input may be of primitive type, if it is a Java-wrappable type,
      // we need to wrap it before marshalling
      if (JavaWrapperUtils.needsWrapping(input)) {
        return DefaultMarshaller.marshallWrappableType(input, ctx);
      } else {
        throw new Error(`Don't know how to marshall ${input}. Portable types must contain a '_fqcn' property!`);
      }
    }

    // Input has fqcn, so, it represents a Java type. We need to check if it
    // is a primitive Java type or not, because this marshaller handles only
    // custom types (i.e. Portable).

    if (JavaWrapperUtils.isJavaType(rootFqcn)) {
      const marshaller = MarshallerProvider.getFor(input);
      const marshalledObject = marshaller.marshall(input, ctx);

      ctx.recordObject(input, marshalledObject);
      return marshalledObject;
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
      } else if (_this[k] === undefined || _this[k] === null) {
        _this[k] = null;
      } else if (_this[k]._fqcn) {
        const marshaller = MarshallerProvider.getFor(_this[k]);
        _this[k] = marshaller.marshall(_this[k], ctx);
      } else {
        _this[k] = this.marshall(_this[k], ctx);
      }
    });

    _this[ErraiObjectConstants.ENCODED_TYPE] = fqcn;
    _this[ErraiObjectConstants.OBJECT_ID] = `${ctx.newObjectId()}`;
    delete _this._fqcn;
    return _this;
  }

  private static marshallWrappableType(input: any, ctx: MarshallingContext): any {
    // convert native JS types to a default Java type implementation
    const wrappedType = JavaWrapperUtils.wrapIfNeeded(input);

    return MarshallerProvider.getFor(wrappedType).marshall(wrappedType, ctx);
  }
}
