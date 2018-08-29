import { JavaArrayList } from "./JavaArrayList";
import { JavaHashSet } from "./JavaHashSet";
import { JavaHashMap } from "./JavaHashMap";
import { JavaBoolean } from "./JavaBoolean";
import { JavaString } from "./JavaString";

export abstract class JavaWrapper<T> {
  public abstract get(): T;

  public static wrapIfNeeded(obj: any): JavaWrapper<any> | undefined {
    if (obj instanceof Array) {
      return new JavaArrayList(obj);
    }

    if (obj instanceof Set) {
      return new JavaHashSet(obj);
    }

    if (obj instanceof Map) {
      return new JavaHashMap(obj);
    }

    if (obj instanceof Boolean || typeof obj === "boolean") {
      return new JavaBoolean(obj as boolean);
    }

    if (obj instanceof String || typeof obj === "string") {
      return new JavaString(obj as string);
    }

    return undefined;
  }

  public static isJavaType(fqcn: string): boolean {
    for (const type in JavaType) {
      if (JavaType[type] === fqcn) {
        return true;
      }
    }
    return false;
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
  BIG_DECIMAL = "java.math.BigDecimal",
  BIG_INTEGER = "java.math.BigInteger",
  ARRAY_LIST = "java.util.ArrayList",
  HASH_SET = "java.util.HashSet",
  HASH_MAP = "java.util.HashMap"
}
