export interface Pojo {
    "^EncodedType": string;
    "^ObjectID": string;
}



type weirdType = { new(...args: any[]): {} };


//Make this decorator have a parameter.
function portable<T extends weirdType>(constructor: T) {
    return class extends constructor {
        _fqcn = "org.uberfire.shared.TestEvent";
    };
}



@portable
class Portable<T> {

    readonly _fqcn?: string;

    //FIXME: Overridable, fix that inside the Decorator.
    readonly serialize?: (() => (T & Pojo)) = () => {
        const _this = {...(this as any)};

        Object.keys(_this).forEach(k => {
            if (typeof _this[k] === "function") {
                delete _this[k];
            }

            else if (_this[k] && _this[k]._fqcn) {
                _this[k] = _this[k].serialize!();
            }
        });

        _this["^EncodedType"] = _this._fqcn;
        _this["^ObjectID"] = "1"; //FIXME: What goes here?
        delete _this._fqcn;

        return _this;
    };
}



//Generated class
export class TestEvent extends Portable<TestEvent> {
    readonly _fqcn?: "org.uberfire.shared.TestEvent";

    foo: string;
    child?: TestEvent;


    constructor(self: TestEvent) {
        super();
        this.foo = self.foo;
        this.child = self.child;
    }
}




