import MarshallerProvider from "appformer/marshalling/MarshallerProvider";

export * from "appformer/Components";
export * from "appformer/API";
export * from "appformer/react/Shorthands";

// Load marshallers to be used in RPC flow
MarshallerProvider.initialize();

// Exposes this module as a global variable
(window as any).appformer = this;
