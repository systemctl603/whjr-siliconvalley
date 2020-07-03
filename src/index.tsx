import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App.jsx";
import { Plugins } from "@capacitor/core";
import * as serviceWorker from "./serviceWorker";

const {Storage} = Plugins;
var events: any;

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
