import PathImpl from "output/uberfire-api/org/uberfire/backend/vfs/PathFactory/PathImpl";
import PathDEC from "appformer/decorators/PathDEC";

export default class PathImplDEC extends PathImpl implements PathDEC {
  public blergs(): string {
    return "path-impl";
  }
}
