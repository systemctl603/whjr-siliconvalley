import React from "react";
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
const { Storage } = Plugins;
var childNum = 1;

async function fetchChildNum() {
  var { value } = await Storage.get({ key: "childnum" });
  value == null ? (value = 0) : (value = parseInt(value));
  return value;
}

export async function addChild(name) {
  var { value } = await Storage.get({ key: "children" });
  value = JSON.parse(value);
  const childnum = await fetchChildNum();
  await Storage.set({ key: "childnum", value: `${++childnum}` });

  console.log(value);
  if (value == null) value = [];
  console.log(value, typeof value);

  value.push(name);
  await Storage.set({
    key: "children",
    value: JSON.stringify(value),
  });
}

export async function getChilds() {
  const { value } = await Storage.get({ key: "children" });
  return JSON.parse(value)
}

export async function removeChild(name) {
  var
}
export async function clearData() {
  await Storage.remove({ key: "children" });
  console.log();
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
