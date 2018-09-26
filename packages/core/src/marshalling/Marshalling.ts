import { Portable } from "../internal/model/Portable";
import { MarshallerProvider } from "./MarshallerProvider";
import { MarshallingContext } from "./MarshallingContext";
import { UnmarshallingContext } from "./UnmarshallingContext";
import { ErraiObjectConstants } from "./model/ErraiObjectConstants";

export function marshall<T>(obj: Portable<T>): string | null {
  if (obj === null || obj === undefined) {
    return null;
  }

  const marshaller = MarshallerProvider.getForObject(obj);
  return JSON.stringify(marshaller.marshall(obj, new MarshallingContext()));
}

export function unmarshall<T>(json: string, oracle: any): Portable<T> | null | void {
  if (json === null || json === undefined) {
    return null;
  }

  const jsonObj = JSON.parse(json);
  const fqcn = jsonObj[ErraiObjectConstants.ENCODED_TYPE];

  const marshaller = MarshallerProvider.getForFqcn(fqcn);
  return marshaller.unmarshall(jsonObj, new UnmarshallingContext(oracle));

  // return JSON.parse(json);
}
