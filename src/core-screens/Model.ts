export interface ErraiBusObject {
    "^EncodedType": string;
    "^ObjectID": string;


    __toJson(): string;
}



//FIXME: I think this value is an unique identifier for instances.
//FIXME: Identify that two objects are the same instance and pass the same value.
let OBJ_ID = 1;



export class Portable<T extends Portable<T>> {

    readonly __fqcn: string;


    constructor(self: any, fqcn: string) {
        if (self) {
            self.__fqcn = fqcn;
            Object.assign(this, self);
        }
    }


    readonly __toErraiBusObject: (() => (T & ErraiBusObject)) = () => {
        const _this = {...(this as any)};

        Object.keys(_this).forEach(k => {
            if (typeof _this[k] === "function") {
                delete _this[k];
            }

            else if (_this[k] && _this[k].__fqcn) {
                _this[k] = _this[k].__toErraiBusObject();
            }

            else if (!_this[k]) {
                _this[k] = null;
            }
        });

        _this["^EncodedType"] = _this.__fqcn;
        _this["^ObjectID"] = `${OBJ_ID++}`;
        delete _this.__fqcn;

        return {
            ..._this, __toJson() {
                return JSON.stringify(this);
            },
        };
    };
}



//Generated class
export class TestEvent extends Portable<TestEvent> {
    bar: string;
    foo: Foo;
    child?: TestEvent;


    constructor(self: {
        bar: string, foo: Foo, child?: TestEvent
    }) {
        super(self, "org.uberfire.shared.TestEvent");
    }
}



//Generated class
export class Foo extends Portable<Foo> {
    foo: string;


    constructor(self: { foo: string }) {
        super(self, "org.uberfire.shared.Foo");
    }
}




