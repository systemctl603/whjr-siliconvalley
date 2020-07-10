import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App.jsx";
import { Plugins } from "@capacitor/core";
import * as serviceWorker from "./serviceWorker";

const { Storage } = Plugins;
var events: any;
console.log("asd");

interface Events {
  [key: string]: any;
}

const fetchEvents: Function = async () => {
  var { value } = await Storage.get({ key: "events" });
  if (value === null) {
    var val: Events = {};
    val.projects = [];
    val.classes = [];
    console.log(val);
    events = val;
    console.log(events);
    await Storage.set({
      key: "events",
      value: JSON.stringify(val),
    });
    return;
  }
  var eventobj = JSON.parse(value);
  console.log(eventobj);
  events = eventobj;
  return "finished";
};
fetchEvents().then(async () => {
  console.log(`slkdkjfljsdlfkjkljL: ${events}`);
  console.log(Object.keys(events));
  Object.keys(events).forEach((key: any) => {
    events[key].forEach((element: any) => {
      if (key === "classes") {
        var edate: Date = new Date(element.endtime);
        if (edate <= new Date()) {
          var idx = events[key].indexOf(element);
          if (idx > -1) {
            var tmp = events[key].splice(idx, 1);
            console.log(`removed ${tmp}`);
          }
        }
      } else if (key === "projects") {
        var date: Date = new Date(element.date);
        if (date <= new Date()) {
          var idx = events[key].indexOf(element);
          if (idx > -1) {
            events[key].splice(idx, 1);
          }
        }
      }
    });
    console.log(events);
  });
  await Storage.set({ key: "events", value: JSON.stringify(events) });
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
