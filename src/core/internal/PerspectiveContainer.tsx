import * as React from "react";
import * as ReactDOM from "react-dom";
import {AppFormer} from "core/Components";
import JsBridge from "core/internal/JsBridge";
import ScreenContainer from "core/internal/ScreenContainer";



interface Props {
    perspective: AppFormer.Perspective;
    screens: AppFormer.Screen[];
    bridge: JsBridge;
    onClose: (screen: AppFormer.Screen) => void;
}



interface State {
}



interface Snapshot {
    shouldRenderPerspective: boolean;
    opened: AppFormer.Screen[];
    kept: { screen: AppFormer.Screen, containerElement: HTMLElement }[];
}



export default class PerspectiveContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {ready: false};
    }


    componentDidMount(): void {
        this.componentDidUpdate(this.props, this.state, {
            shouldRenderPerspective: true, opened: this.props.screens, kept: [],
        });
    }


    getSnapshotBeforeUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): Snapshot {

        const diff = (a: AppFormer.Screen[], b: AppFormer.Screen[]) => {
            return a.filter((i) => b.indexOf(i) < 0);
        };

        const intersect = (a: AppFormer.Screen[], b: AppFormer.Screen[]) => {
            return a.filter(i => -1 !== b.indexOf(i));
        };

        const keptScreens = intersect(this.props.screens, prevProps.screens);
        const closedScreens = diff(diff(prevProps.screens, this.props.screens), keptScreens);
        const openedScreens = diff(diff(this.props.screens, prevProps.screens), keptScreens);

        closedScreens.forEach(screen => {
            this.closeScreen(screen, prevProps.perspective);
        });

        return {
            shouldRenderPerspective: prevProps.perspective !== this.props.perspective,
            opened: openedScreens,
            kept: keptScreens.map(s => ({
                screen: s,
                containerElement: PerspectiveContainer.findContainerFor(s, prevProps.perspective)!,
            })),
        };
    }


    componentDidUpdate(prevProps: Readonly<Props>,
                       prevState: Readonly<State>,
                       snapshot?: Snapshot): void {


        if (!snapshot!.shouldRenderPerspective) {
            this.renderScreens(snapshot!);
            return;
        }

        if (this.props.perspective.isReact) {
            this.renderScreens(snapshot!);
            return;
        }

        this.props.bridge.render(this.props.perspective.af_perspectiveRoot(),
                                 PerspectiveContainer.findSelfContainerElement(this.props.perspective)!,
                                 () => this.renderScreens(snapshot!));
    }


    private renderScreens(snapshot: Snapshot) {
        snapshot.kept.forEach(kept => { this.keepScreen(kept.screen, kept.containerElement); });
        snapshot.opened.forEach(screen => { this.openScreen(screen); });
    }


    private openScreen(screen: AppFormer.Screen) {
        const container = PerspectiveContainer.findContainerFor(screen, this.props.perspective);
        if (container) {
            const screenContainer = <ScreenContainer
                key={screen.af_componentId}
                bridge={this.props.bridge}
                screen={screen}
                onClose={() => this.props.onClose(screen)}
            />;

            ReactDOM.render(screenContainer, container as HTMLElement, () => {
                container.setAttribute(PerspectiveContainer.OpenScreenAttributeName,
                                       screen.af_componentId);
            });
        } else {
            console.error(`[O] A default screen container for ${screen.af_componentId} should exist at this point for sure.`);
        }
    }


    private keepScreen(screen: AppFormer.Screen, formerContainerElement: HTMLElement) {
        const container = PerspectiveContainer.findContainerFor(screen, this.props.perspective);

        if (container) {

            formerContainerElement.id = container.id;

            Array.prototype.slice.call(formerContainerElement.attributes).forEach((x: Attr) => {
                if (!container.hasAttribute(x.name)) {
                    formerContainerElement.removeAttribute(x.name);
                } else {
                    formerContainerElement.setAttribute(x.name,
                                                        container.getAttribute(x.name) || "");
                }
            });

            formerContainerElement.setAttribute(PerspectiveContainer.OpenScreenAttributeName,
                                                screen.af_componentId);

            //FIXME: this "replaceWith" method does not work on IE.
            (container as any).replaceWith(formerContainerElement);
        } else {
            console.error(`[K] A default screen container for ${screen.af_componentId} should exist at this point for sure.`);
        }
    }


    private closeScreen(screen: AppFormer.Screen, perspective: AppFormer.Perspective) {
        const container = PerspectiveContainer.findContainerFor(screen, perspective);
        if (container) {
            ReactDOM.unmountComponentAtNode(container as HTMLElement);
            container.removeAttribute(PerspectiveContainer.OpenScreenAttributeName);
        } else {
            console.error(`[C] A screen container for ${screen.af_componentId} should exist at this point for sure.`);
        }
    }


    componentWillUnmount(): void {
        console.info(`...Unmounting ${this.props.perspective.af_componentId}...`);
        console.info(`Unmounted ${this.props.perspective.af_componentId}.`);
    }


    render() {
        return <>
            <div className={"af-perspective-container"}
                 key={this.props.perspective.af_componentId}
                 id={PerspectiveContainer.getSelfContainerElementId(this.props.perspective)}>

                {/*Empty on purpose*/}
                {/*This is where the perspective will be rendered on.*/}
                {/*See `componentDidMount` and `componentWillUnmount`*/}
                {/*If it is a ReactElement we can embedded it directly*/}
                {this.props.perspective.isReact && this.props.perspective.af_perspectiveRoot()}

            </div>
        </>;
    }


    private static getSelfContainerElementId(perspective: AppFormer.Perspective) {
        return "self-perspective-" + perspective.af_componentId;
    }


    private static findSelfContainerElement(perspective: AppFormer.Perspective) {
        return document.getElementById(this.getSelfContainerElementId(perspective));
    }


    public static OpenScreenAttributeName = "af-open-screen";


    public static findContainerFor(screen: AppFormer.Screen, perspective: AppFormer.Perspective) {

        const root = this.findSelfContainerElement(perspective)!;
        return searchTree(root, AppFormer.Screen.containerId(screen)) ||
               searchTree(root, AppFormer.DefaultScreenContainerId);
    }
}


function searchTree(root: HTMLElement, id: string) {
    let stack = [root], node: any;
    stack.push(root);

    while (stack.length > 0) {
        node = stack.pop()!;
        if (node instanceof HTMLElement && (node as HTMLElement).id === id) {
            return node;
        } else if (node.children && node.children.length) {
            for (let ii = 0; ii < node.children.length; ii += 1) {
                stack.push(node.children[ii]);
            }
        }
    }

    return null;
}