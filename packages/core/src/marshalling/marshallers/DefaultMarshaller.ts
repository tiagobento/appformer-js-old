import { MarshallerProvider } from "../MarshallerProvider";
import { MarshallingContext } from "../MarshallingContext";
import { ErraiObject } from "../model/ErraiObject";
import { JavaWrapperUtils } from "../../java-wrappers/JavaWrapperUtils";
import { ErraiObjectConstants } from "../model/ErraiObjectConstants";
import { Portable } from "../../internal/model/Portable";
import { NullableMarshaller } from "./NullableMarshaller";
import { UnmarshallingContext } from "../UnmarshallingContext";

export class DefaultMarshaller<T extends Portable<T>> extends NullableMarshaller<
  T,
  ErraiObject,
  ErraiObject,
  Portable<any>
> {
  public notNullMarshall(input: T, ctx: MarshallingContext): ErraiObject {
    const cachedObject = ctx.getCached(input);
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
      const marshaller = MarshallerProvider.getForObject(input);
      const marshalledObject = marshaller.marshall(input, ctx);

      ctx.cacheObject(input, marshalledObject);
      return marshalledObject;
    }

    const _this = this.marshallCustomObject(input, ctx, rootFqcn);

    ctx.cacheObject(input, _this);

    return _this;
  }

  public notNullUnmarshall(input: ErraiObject, ctx: UnmarshallingContext): Portable<any> {
    const cachedObject = ctx.getCached(input);
    if (cachedObject) {
      return cachedObject;
    }

    const rootFqcn = input[ErraiObjectConstants.ENCODED_TYPE];
    if (!rootFqcn) {
      return DefaultMarshaller.unmarshallUnqualifiedValue(input, ctx);
    }

    const targetFactory = ctx.getFactory(rootFqcn);
    if (!targetFactory) {
      // this input is not a custom object, otherwise, we would be able to find a factory function.
      // try to unmarshall it as a java type (that we know how to build)
      return DefaultMarshaller.unmarshallJavaType(rootFqcn, input, ctx);
    }

    const targetObj = this.unmarshallCustomObject(targetFactory, input, ctx);

    ctx.cacheObject(input, targetObj);

    return targetObj;
  }

  private marshallCustomObject(input: any, ctx: MarshallingContext, fqcn: string) {
    const _this = { ...input };

    Object.keys(_this).forEach(k => {
      if (typeof _this[k] === "function") {
        delete _this[k];
      } else if (_this[k] === undefined || _this[k] === null) {
        _this[k] = null;
      } else if (_this[k]._fqcn) {
        const marshaller = MarshallerProvider.getForObject(_this[k]);
        _this[k] = marshaller.marshall(_this[k], ctx);
      } else {
        _this[k] = this.marshall(_this[k], ctx);
      }
    });

    _this[ErraiObjectConstants.ENCODED_TYPE] = fqcn;
    _this[ErraiObjectConstants.OBJECT_ID] = `${ctx.incrementAndGetObjectId()}`;
    delete _this._fqcn;
    return _this;
  }

  private unmarshallCustomObject(targetFactory: (data: any) => any, input: ErraiObject, ctx: UnmarshallingContext) {
    // instantiate an empty target object in order to be able to discover the
    // types of unqualified values present in the JSON
    const emptyTargetObj = targetFactory({});

    // clone the input, removing non useful fields
    const _this = { ...(input as any) };
    delete _this[ErraiObjectConstants.ENCODED_TYPE];
    delete _this[ErraiObjectConstants.OBJECT_ID];

    const targetData = {} as any;
    Object.keys(_this).forEach(k => {
      const fqcn = _this[k][ErraiObjectConstants.ENCODED_TYPE];
      if (_this[k] === null || _this[k] === undefined) {
        targetData[k] = null;
      } else if (fqcn) {
        const unmarshalledValue = MarshallerProvider.getForFqcn(fqcn).unmarshall(_this[k], ctx);
        targetData[k] = DefaultMarshaller.autoWrap(unmarshalledValue, k, emptyTargetObj);
      } else {
        // no fqcn, try to infer it asking the field's type to the target object
        const inferredFqcn = DefaultMarshaller.qualifyValue(k, _this[k], emptyTargetObj);
        if (!inferredFqcn) {
          throw new Error(`Don't know how to unmarshall field ${k} of ${input}`);
        }
        const unmarshalledValue = MarshallerProvider.getForFqcn(inferredFqcn).unmarshall(_this[k], ctx);
        targetData[k] = DefaultMarshaller.autoWrap(unmarshalledValue, k, emptyTargetObj);
      }
    });

    return targetFactory(targetData);
  }

  private static marshallWrappableType(input: any, ctx: MarshallingContext): any {
    // convert native JS types to a default Java type implementation
    const wrappedType = JavaWrapperUtils.wrapIfNeeded(input);

    return MarshallerProvider.getForObject(wrappedType).marshall(wrappedType, ctx);
  }

  private static unmarshallJavaType(fqcn: string, input: ErraiObject, ctx: UnmarshallingContext) {
    if (!JavaWrapperUtils.isJavaType(fqcn)) {
      throw new Error(`No factory provided for ${fqcn}. Cannot unmarshall.`);
    }

    return MarshallerProvider.getForFqcn(fqcn).unmarshall(input, ctx);
  }

  private static unmarshallUnqualifiedValue(input: ErraiObject, ctx: UnmarshallingContext) {
    if (!JavaWrapperUtils.needsWrapping(input)) {
      // field is not wrappable, so, there's no way to know what is the target object
      throw new Error("Don't know how to unmarshall types without encoded type");
    }

    // qualify the input (i.e. discover its fqcn)
    const wrappedType = JavaWrapperUtils.wrapIfNeeded(input);

    return MarshallerProvider.getForObject(wrappedType).unmarshall(wrappedType, ctx);
  }

  private static qualifyValue(fieldName: string, fieldValue: any, targetObj: any): string | undefined {
    if (JavaWrapperUtils.needsWrapping(fieldValue)) {
      return (JavaWrapperUtils.wrapIfNeeded(fieldValue) as any)._fqcn;
    }

    return (targetObj[fieldName] as any)._fqcn;
  }

  private static autoWrap(unmarshalledValue: any, fieldName: string, targetObj: any): any {
    // wrap native types if the target object wants its java-wrapped version

    if (!targetObj[fieldName] || !targetObj[fieldName]._fqcn) {
      // target obj is not defined or doesn't have a fqcn, therefore, the field
      // is not java-wrapped (otherwise, it would have a _fqcn defined)
      return unmarshalledValue;
    }

    if (unmarshalledValue._fqcn) {
      // the just unmarshalled value has a fqcn, then, it's not a native type
      return unmarshalledValue;
    }

    // the field in the target obj has a fqcn and our unmarshalled value hasn't, we need to wrap it.
    return JavaWrapperUtils.wrapIfNeeded(unmarshalledValue);
  }
}
