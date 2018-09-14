import { MarshallerProvider } from "marshalling/MarshallerProvider";


export * from "./Marshalling";

// Load marshallers to be used in RPC flow
MarshallerProvider.initialize();
