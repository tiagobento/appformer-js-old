import { Portable } from "./model/Portable";
import { ErraiMarshaller, MarshallerProvider } from "./ErraiMarshaller";

export function marshall(obj: Portable | string) {
  MarshallerProvider.initialize();
  const erraiMarshaller = new ErraiMarshaller({ marshallerProvider: new MarshallerProvider() });

  return typeof obj !== "string" ? JSON.stringify(erraiMarshaller.marshall(obj)) : obj;
}

// TODO: Implement to return an object from the Model file
export function unmarshall(json: any) {
  return json;
}
