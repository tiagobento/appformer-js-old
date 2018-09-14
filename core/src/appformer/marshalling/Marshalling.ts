import Portable from "appformer/internal/model/Portable";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export function marshall(obj: Portable<any>): string | null {
  if (obj === null || obj === undefined) {
    return null;
  }

  const marshaller = MarshallerProvider.getFor(obj);
  return JSON.stringify(marshaller.marshall(obj, new MarshallingContext()));
}

// TODO: Implement to return an object from the Model file
export function unmarshall(json: any, oracle: any) {
  return JSON.parse(json); //TODO: Implement
}
