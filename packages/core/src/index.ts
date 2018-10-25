import {initSingleton} from "./appformer";



export * from "./appformer";
export * from "./marshalling";
export * from "./core";
export * from "./appformer";
export * from "./java-wrappers";

// Exposes this module as a global variable
(window as any).AppFormer = this;
initSingleton();