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
        <Ionic.IonTitle>Add Project</Ionic.IonTitle>
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
          <Ionic.IonLabel>Project Name: </Ionic.IonLabel>
          <Ionic.IonInput id="title"></Ionic.IonInput>
          <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Due Date:</Ionic.IonLabel>
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
            const notifs = await LocalNotifications.schedule({
              notifications: [
                {
                  title: `Project - ${title}`,
                  body: "",
                  id: 1,
                  schedule: { at: new Date(datetime) },
                  sound: null,
                  attachments: null,
                  actionTypeId: "",
                  extra: null
                }
              ]
            });
          }}
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
