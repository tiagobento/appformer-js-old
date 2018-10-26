import { MarshallerProvider } from "./MarshallerProvider";

export * from "./Marshalling";
export * from "./Portable";

// Load marshallers to be used in RPC flow
MarshallerProvider.initialize();
