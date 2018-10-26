export const DefaultComponentContainerId = "af-js-default-screen-container";

export interface Subscriptions {
  [channel: string]: (event: any) => void;
}

export interface Service {
  [name: string]: any; //FIXME: 'any' is a baaad choice
}

export class Menu {
  // TODO
}

export class Toolbar {
  // TODO
}
