import ObservablePathImpl from "output/uberfire-api/org/uberfire/backend/vfs/impl/ObservablePathImpl";
import ObservablePathDEC from "appformer/appformer-decorators/ObservablePathDEC";

export default class ObservablePathImplDEC extends ObservablePathImpl implements ObservablePathDEC {
  public blergs(): string {
    return "observable-path-impl";
  }
}
