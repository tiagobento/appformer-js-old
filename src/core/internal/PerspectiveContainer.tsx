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
    closed: AppFormer.Screen[];
    kept: { screen: AppFormer.Screen, containerElement: HTMLElement }[];
};

export default class PerspectiveContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {ready: false};
    }

    componentDidMount(): void {
        this.componentDidUpdate(this.props, this.state, {
            shouldRenderPerspective: true,
            opened: this.props.screens,
            kept: [],
            closed: []
        });
    }


    componentDidUpdate(prevProps: Readonly<Props>,
                       prevState: Readonly<State>,
                       snapshot?: Snapshot): void {

        console.info(snapshot);

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

    getSnapshotBeforeUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): Snapshot {

        const diff = (a: AppFormer.Screen[], b: AppFormer.Screen[]) => {
            return a.filter((i) => b.indexOf(i) < 0);
        };

        const intersect = (a: AppFormer.Screen[], b: AppFormer.Screen[]) => {
            return a.filter(i => -1 !== b.indexOf(i));
        };

        const kept = intersect(this.props.screens, prevProps.screens).map(screen => ({
            screen: screen,
            containerElement: PerspectiveContainer.findContainerFor(screen, prevProps.perspective)!
        }));

        return {
            shouldRenderPerspective: prevProps.perspective !== this.props.perspective,
            opened: diff(diff(this.props.screens, prevProps.screens), kept.map(s => s.screen)),
            closed: diff(diff(prevProps.screens, this.props.screens), kept.map(s => s.screen)),
            kept: kept
        };
    }


    private renderScreens(snapshot: Snapshot) {

        if (!snapshot.shouldRenderPerspective) {
            snapshot.closed.forEach(screen => {
                const container = PerspectiveContainer.findContainerFor(screen,
                                                                        this.props.perspective);

                if (!container) {
                    console.error(`[C] A screen container for ${screen.af_componentId} should exist at this point for sure.`);
                    return;
                }

                ReactDOM.unmountComponentAtNode(container);
            });
        }

        snapshot.kept.forEach(kept => {

            const container = PerspectiveContainer.findContainerFor(kept.screen,
                                                                    this.props.perspective);

            if (!container) {
                console.error(`[K] A default screen container for ${kept.screen.af_componentId} should exist at this point for sure.`);
                return;
            }

            kept.containerElement.id = container.id; //For when default-container contains a kept screen.
            (container as any).replaceWith(kept.containerElement);
        });

        snapshot.opened.forEach(screen => {
            const container = PerspectiveContainer.findContainerFor(screen, this.props.perspective);

            if (!container) {
                console.error(`[O] A default screen container for ${screen.af_componentId} should exist at this point for sure.`);
                return;
            }

            this.renderScreen(screen, container);
        });

    }


    private renderScreen(screen: AppFormer.Screen, container: Node) {
        ReactDOM.render(<ScreenContainer
            key={screen.af_componentId}
            bridge={this.props.bridge}
            screen={screen}
            onClose={() => this.props.onClose(screen)}
        />, container as HTMLElement, () => {
        });
    }



    componentWillUnmount(): void {
        console.info(`...Unmounting ${this.props.perspective.af_componentId}...`);
        ReactDOM.unmountComponentAtNode(PerspectiveContainer.findSelfContainerElement(this.props.perspective)!);
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

    public static findContainerFor(screen: AppFormer.Screen, perspective: AppFormer.Perspective) {

        const root = this.findSelfContainerElement(perspective)!;
        return searchTree(root, AppFormer.Screen.containerId(screen)) ||
               searchTree(root, AppFormer.DefaultScreenContainerId)
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