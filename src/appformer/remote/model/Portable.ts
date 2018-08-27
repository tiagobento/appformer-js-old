export interface Portable {
  getFqcn(): { value: () => string; prototype: {}; new (): {} };
}
