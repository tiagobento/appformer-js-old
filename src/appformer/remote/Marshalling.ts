import { Portable } from "./model/Portable";
import { ErraiMarshaller } from "./ErraiMarshaller";
import { MarshallerProvider } from "./MarshallerProvider";

export function marshall(obj: Portable | string) {
  MarshallerProvider.initialize();
  const erraiMarshaller = new ErraiMarshaller({ marshallerProvider: new MarshallerProvider() });

  return JSON.stringify(erraiMarshaller.marshall(obj));
}

// TODO: Implement to return an object from the Model file
export function unmarshall(json: any) {
  return json;
}
