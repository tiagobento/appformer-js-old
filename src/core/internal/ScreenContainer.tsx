import * as React from "react";
import {AppFormer} from "core/Components";

interface Props {
    containerId: string;
    screen: AppFormer.Screen;
    onClose: () => void;
}

export default class ScreenContainer extends React.Component<Props, {}> {

    constructor(props: Props) {
        super(props);
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
                    {/*Each screens gets a fresh container*/}
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