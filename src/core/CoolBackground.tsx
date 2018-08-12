import * as React from "react";

export function CoolBackground() {
    return <div style={{overflow: "hidden", position: "absolute", width: "100%", height: "100%"}}>
        <h1 style={{
            position: "absolute",
            top: "-150px",
            left: "-120px",
            margin: 0,
            zIndex: -20,
            fontSize: "60em",
            maxHeight: "0",
            textAlign: "left",
            fontWeight: "lighter",
            opacity: 0.02,
            color: "black"
        }}>App</h1>

        <h1 style={{
            position: "absolute",
            top: "384px",
            left: "170px",
            marginTop: "100px",
            zIndex: -20,
            fontSize: "30em",
            maxHeight: "0",
            textAlign: "left",
            fontWeight: "lighter",
            opacity: 0.04,
            color: "black"
        }}>Former.js</h1>

        <span style={{
            bottom: 0, position: "absolute", right: 0, padding: "10px"
        }}>AppFormer.js</span>
    </div>
}