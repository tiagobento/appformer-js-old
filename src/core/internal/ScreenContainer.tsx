import * as React from "react";
import {AppFormer} from "core/Components";
import JsBridge from "core/internal/JsBridge";

interface Props {
    screen: AppFormer.Screen;
    onClose: () => void;
    bridge: JsBridge;
}

export default class ScreenContainer extends React.Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    getSelfContainerElement() {
        return document.getElementById(ScreenContainer.getSelfContainerElementId(this.props.screen));
    }

    componentDidMount(): void {
        const screen = this.props.screen;
        console.info(`...Rendering ${screen.af_componentId}...`);

        if (this.props.screen.isReact) {
            this.invokeOnOpen();
        } else {
            this.props.bridge.render(screen.af_componentRoot(),
                                     this.getSelfContainerElement()!,
                                     () => this.invokeOnOpen());
        }
    }

    private invokeOnOpen() {
        console.info(`Rendered ${this.props.screen.af_componentId}`);
        console.info(`...Opening ${this.props.screen.af_componentId}...`);
        this.props.screen.af_onOpen();
        console.info(`Opened ${this.props.screen.af_componentId}.`);
    }

    componentWillUnmount(): void {
        const screen = this.props.screen;
        console.info(`...Closing ${screen.af_componentId}...`);
        screen.af_onClose();
        console.info(`Closed ${screen.af_componentId}.`);
    }

    render() {
        const screen = this.props.screen;
        return <>
            <div className={"af-screen-container"}
                 key={screen.af_componentId}
                 onFocus={() => screen.af_onFocus()}
                 onBlur={() => screen.af_onLostFocus()}>

                <div className={"title"}>
                    {this.TitleBar(screen)}
                </div>

                <div className={"contents"}
                     key={this.props.screen.af_componentId}
                     id={`${ScreenContainer.getSelfContainerElementId(this.props.screen)}`}>
                    {/*Empty on purpose*/}
                    {/*This is where the screens will be rendered on.*/}
                    {/*See `componentDidMount` and `componentWillUnmount`*/}
                    {this.props.screen.isReact && this.props.screen.af_componentRoot()}
                </div>
            </div>
        </>;
    }

    private TitleBar(screen: AppFormer.Screen) {
        return <>
            <span>
                <span>{screen.af_componentTitle}</span>
                &nbsp;&nbsp;
                <a href="#" onClick={() => this.props.onClose()}>Close</a>
            </span>
        </>;
    }

    private static getSelfContainerElementId(screen: AppFormer.Screen) {
        return "self-screen-" + screen.af_componentId;
    }
}