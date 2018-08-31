import Portable from "appformer/internal/model/Portable";
import MarshallerProvider from "appformer/marshalling/MarshallerProvider";
import MarshallingContext from "appformer/marshalling/MarshallingContext";

export function marshall(obj: Portable) {
  const marshaller = MarshallerProvider.getFor(obj);
  return JSON.stringify(marshaller.marshall(obj, new MarshallingContext()));
}

// TODO: Implement to return an object from the Model file
export function unmarshall(json: any) {
  return json;
}
