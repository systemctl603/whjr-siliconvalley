import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { triangle } from "ionicons/icons";
import HomePage from "./pages/main.jsx";
import { Plugins } from "@capacitor/core";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
var childNum;
async function fetchChildNum() {
  var { value } = await Storage.get({});
}
const { Storage } = Plugins;
export async function addChild(name) {
  var { value } = await Storage.get({ key: "childIndx" });
  console.log(value);
  if (typeof value != "string") {
    console.log(typeof value);
    await Storage.set({
      key: "childIndx",
      value: "2",
    });
    value = "1";
    console.log("test");
  } else {
    value++;
  }
  await Storage.set({
    key: `child${value}`,
    value: JSON.stringify({
      name: name,
      index: value,
    }),
  });
}

export async function getChilds() {
  const { value } = await Storage.get({ key: "child1" });
  console.log(JSON.parse(value));
}

export const App = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <HomePage />
        </IonRouterOutlet>
        <IonTabBar slot="bottom"></IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);
