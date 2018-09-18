export function isString(input: any): boolean {
  return typeof input === "string" || input instanceof String;
}

export function isArray(obj: any): boolean {
  return obj instanceof Array;
}

export function isSet(obj: any): boolean {
  return obj instanceof Set;
}

export function isMap(obj: any): boolean {
  return obj instanceof Map;
}

export function isBoolean(obj: any): boolean {
  return typeof obj === "boolean" || obj instanceof Boolean;
}

export function isDate(obj: any): boolean {
  return obj instanceof Date;
}
