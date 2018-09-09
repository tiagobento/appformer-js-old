import JavaArrayList from "appformer/java-wrappers/JavaArrayList";
import JavaHashSet from "appformer/java-wrappers/JavaHashSet";
import JavaHashMap from "appformer/java-wrappers/JavaHashMap";
import JavaBoolean from "appformer/java-wrappers/JavaBoolean";
import JavaString from "appformer/java-wrappers/JavaString";
import Portable from "appformer/internal/model/Portable";
import JavaDate from "appformer/java-wrappers/JavaDate";

export default abstract class JavaWrapper<T> implements Portable<JavaWrapper<T>> {
  private static wrappingFuncForType: Map<(obj: any) => boolean, (obj: any) => JavaWrapper<any>> = new Map([
    [JavaWrapper.isArray, (obj: any) => new JavaArrayList(obj) as JavaWrapper<any>],
    [JavaWrapper.isSet, (obj: any) => new JavaHashSet(obj) as JavaWrapper<any>],
    [JavaWrapper.isMap, (obj: any) => new JavaHashMap(obj) as JavaWrapper<any>],
    [JavaWrapper.isBoolean, (obj: any) => new JavaBoolean(obj) as JavaWrapper<any>],
    [JavaWrapper.isString, (obj: any) => new JavaString(obj) as JavaWrapper<any>],
    [JavaWrapper.isDate, (obj: any) => new JavaDate(obj) as JavaWrapper<any>]
  ]);

  public abstract get(): T;

  public static needsWrapping(obj: any): boolean {
    return this.getWrappingFunction(obj) !== undefined;
  }

  public static wrapIfNeeded(obj: any): JavaWrapper<any> | undefined {
    const func = this.getWrappingFunction(obj);
    if (!func) {
      return undefined;
    }

    return func(obj);
  }

  public static isJavaType(fqcn: string): boolean {
    for (const type in JavaType) {
      if (JavaType[type] === fqcn) {
        return true;
      }
    }
    return false;
  }

  private static getWrappingFunction(obj: any): ((obj: any) => JavaWrapper<any>) | undefined {
    //tslint:disable-next-line
    let result: ((obj: any) => JavaWrapper<any>) | undefined = undefined;

    this.wrappingFuncForType.forEach((wrapFunction, typeFilterFunction) => {
      if (result) {
        return;
      }

      if (typeFilterFunction(obj)) {
        result = wrapFunction;
      }
    });

    return result;
  }

  private static isArray(obj: any): boolean {
    return obj instanceof Array;
  }

  private static isSet(obj: any): boolean {
    return obj instanceof Set;
  }

  private static isMap(obj: any): boolean {
    return obj instanceof Map;
  }

  private static isBoolean(obj: any): boolean {
    return obj instanceof Boolean || typeof obj === "boolean";
  }

  private static isString(obj: any): boolean {
    return obj instanceof String || typeof obj === "string";
  }

  private static isDate(obj: any): boolean {
    return obj instanceof Date;
  }
}

export enum JavaType {
  BYTE = "java.lang.Byte",
  DOUBLE = "java.lang.Double",
  FLOAT = "java.lang.Float",
  INTEGER = "java.lang.Integer",
  LONG = "java.lang.Long",
  SHORT = "java.lang.Short",
  BOOLEAN = "java.lang.Boolean",
  STRING = "java.lang.String",
  DATE = "java.util.Date",
  BIG_DECIMAL = "java.math.BigDecimal",
  BIG_INTEGER = "java.math.BigInteger",
  ARRAY_LIST = "java.util.ArrayList",
  HASH_SET = "java.util.HashSet",
  HASH_MAP = "java.util.HashMap"
}
