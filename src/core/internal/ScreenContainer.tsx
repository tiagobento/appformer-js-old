import * as React from "react";
import * as ReactDOM from "react-dom";
import {AppFormer} from "core/Components";
import JsBridge from "core/internal/JsBridge";

interface Props {
    containerId: string;
    screen: AppFormer.Screen;
    onClose: () => void;
    bridge: JsBridge;
}

export default class ScreenContainer extends React.Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount(): void {
        const screen = this.props.screen;
        this.props.bridge.render(screen.af_componentRoot(), this.getDomContainer()!, () => {
            console.info(`Rendered ${screen.af_componentId}`);
            this.props.screen.af_onOpen();
            console.info(`Opened ${screen.af_componentId}...`);
        });
    }

    componentWillUnmount(): void {
        const screen = this.props.screen;
        screen.af_onClose();
        console.info(`Unmounting ${screen.af_componentId}...`);
        ReactDOM.unmountComponentAtNode(this.getDomContainer()!);
    }

    private getDomContainer() {
        return document.getElementById(this.props.containerId);
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

                <div className={"contents"} id={this.props.containerId}>
                    {/*Empty on purpose*/}
                    {/*This is where the screens will be rendered on.*/}
                    {/*See `componentDidMount` and `componentWillUnmount`*/}
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
}