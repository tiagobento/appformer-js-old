import {ReactElement} from "react";
import * as ReactDOM from "react-dom";

export * from './Clazz';
export * from './Components';

export function render(component: () => ReactElement<any>,
                       container: HTMLElement) {

    ReactDOM.render(component(), container);
}

//Expose this module as a global variable
(<any>window).appformer = this;

