import React from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import { Plugins } from "@capacitor/core";

const { Storage, LocalNotifications } = Plugins;

export default function AddProjectMenu(props) {
  return (
    <Ionic.IonModal
      isOpen={props.hook}
      cssClass="childMenu"
      onDidDismiss={() => props.hookChange(false)}
    >
      <Ionic.IonToolbar>
        <Ionic.IonTitle>Add Reminder</Ionic.IonTitle>
        <hr />
        <Ionic.IonFabButton
          size="small"
          slot="end"
          onClick={() => props.hookChange(false)}
        >
          <Ionic.IonIcon icon={Icons.exitOutline}></Ionic.IonIcon>
        </Ionic.IonFabButton>
      </Ionic.IonToolbar>
      <form id="form">
        <Ionic.IonItem>
          <Ionic.IonLabel>Reminder Name: </Ionic.IonLabel>
          <Ionic.IonInput id="title"></Ionic.IonInput>
          <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Date: </Ionic.IonLabel>
          <Ionic.IonDatetime
            min="2000"
            max="2040"
            id="datetime"
            displayFormat="MMM DD, YYYY hh:mm A"
          ></Ionic.IonDatetime>
        </Ionic.IonItem>

        <Ionic.IonButton
          expand="full"
          onClick={async () => {
            var datetime = document.getElementById("datetime").value;
            var title = document.getElementById("title").value;

            if (datetime === undefined || title === "") {
              window.alert("Some fields are empty");
              return;
            } else if (new Date(datetime) < new Date()) {
              window.alert("Date is not valid");
              return;
            }

            var { value } = await Storage.get({ key: "events" });
            var id = await Storage.get({ key: "nextid" });
            id.value === null ? (id = 1) : (id = parseInt(id.value));
            if (value === null) {
              value = {};
              value.classes = [];
              value.projects = [];
              await Storage.set({
                key: "events",
                value: JSON.stringify(value),
              });
            } else {
              value = JSON.parse(value);
            }
            value.projects.push({
              title: title,
              date: datetime,
              id: id,
            });

            const notifs = await LocalNotifications.schedule({
              notifications: [
                {
                  title: `Reminder - ${title}`,
                  body: "",
                  id: id,
                  schedule: { at: new Date(datetime) },
                  sound: null,
                  attachments: null,
                  actionTypeId: "",
                  extra: null,
                },
              ],
            });
            id++;
            await Storage.set({
              key: "nextid",
              value: id.toString(),
            });
            await Storage.set({
              key: "events",
              value: JSON.stringify(value),
            });
            props.callback();
          }}
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
