import React from "react";
import { IonApp, IonRouterOutlet, IonTabBar, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import HomePage from "./pages/main.jsx";
import { Plugins } from "@capacitor/core";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
const { Storage, LocalNotifications } = Plugins;

var events;
async function getEvents() {
  var eventarr = (await Storage.get({ key: "events" })).value;
  console.log(eventarr);
  eventarr = JSON.parse(eventarr);
  events = eventarr;
}
getEvents();

async function saveToEvents(arr) {
  console.log(JSON.stringify(arr));
  await Storage.set({
    key: "events",
    value: JSON.stringify(arr),
  });
}

for (var key in events) {
  key.filter((element) => {
    var date = new Date(element.date);
    var currentDate = new Date();
    if (date < currentDate) {
      return false;
    } else {
      return true;
    }
  });
}
saveToEvents(events);

async function fetchPeopleNum() {
  var { value } = await Storage.get({ key: "peoplenum" });
  value == null ? (value = 0) : (value = parseInt(value));
  return value;
}

export function getDaysBetween(start, end) {
  for (
    var arr = [], dt = new Date(start);
    dt <= end;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
}

export async function addPerson(name) {
  var { value } = await Storage.get({ key: "people" });
  value = JSON.parse(value);
  const peoplenum = await fetchPeopleNum();
  await Storage.set({ key: "peoplenum", value: `${peoplenum + 1}` });

  console.log(value);
  if (value == null) value = [];
  console.log(value, typeof value);

  value.push(name);
  await Storage.set({
    key: "people",
    value: JSON.stringify(value),
  });
}

export async function getPersons() {
  const { value } = await Storage.get({ key: "people" });
  return JSON.parse(value);
}

export async function removePerson(name) {
  var personarr = await getPersons();
  var idx = personarr.indexOf(name);
  if (idx !== -1) {
    personarr.splice(idx, 1);
    await Storage.set({
      key: "people",
      value: JSON.stringify(personarr),
    });
  } else {
    return "Not in array";
  }
}

export async function clearData() {
  await Storage.remove({ key: "people" });
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
