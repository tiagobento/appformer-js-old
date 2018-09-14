import { JavaDouble } from "java-wrappers/JavaDouble";
import { JavaInteger } from "java-wrappers/JavaInteger";
import { JavaShort } from "java-wrappers/JavaShort";
import { JavaByte } from "java-wrappers/JavaByte";
import { JavaFloat } from "java-wrappers/JavaFloat";
import { BigNumber } from "bignumber.js";
import { JavaLong } from "java-wrappers/JavaLong";

export interface JavaNumber {
  doubleValue(): JavaDouble;
  intValue(): JavaInteger;
  shortValue(): JavaShort;
  byteValue(): JavaByte;
  floatValue(): JavaFloat;
  longValue(): JavaLong;
}

export function asDouble(n: number | BigNumber) {
  return new JavaDouble(n.toString(10));
}

export function asInteger(n: number | BigNumber) {
  return new JavaInteger(n.toString(10));
}

export function asShort(n: number | BigNumber) {
  return new JavaShort(n.toString(10));
}

export function asByte(n: number | BigNumber) {
  return new JavaByte(n.toString(10));
}

export function asFloat(n: number | BigNumber) {
  return new JavaFloat(n.toString(10));
}

export function asLong(n: number | BigNumber) {
  return new JavaLong(n.toString(10));
}
