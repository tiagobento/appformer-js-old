import React from "react";
import {ShoppingList} from "../core";

export class OtherList extends React.Component {
    render() {
        return (
            <div className="shopping-list">
                <h1>List for stuff</h1>
                <ul>
                    <li>React</li>
                    <li>Babel</li>
                </ul>
                <ShoppingList name={"Test"} number={this.props.number}/>
            </div>
        );
    }
}