import React, { useState } from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import {Plugins} from "@capacitor/core";

const {Storage, LocalNotifications} = Plugins;

export default function AddClassMenu(props) {
  const [showAlert, setShowAlert] = useState(false)
  const [intersectingClasses, setIntersectingClasses] = useState(["test"]);
  const showExceptions = () => {
    setShowAlert(true);
  }
  const scheduleNotification = async (title, date, notes) => {
    date = new Date(date);
    var {value} = await Storage.get({key:"events"});
    value = JSON.parse(value);
    value.classes.push({title: title, date: date})
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: notes,
          id: 1,
          schedule: { at: date },
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    })
    await Storage.set({key: "events", value: JSON.stringify(value)})
  }
  return (
    <Ionic.IonModal
      isOpen={props.hook}
      cssClass="childMenu"
      onDidDismiss={() => props.hookChange(false)}
    >
      <Ionic.IonToolbar>
        <Ionic.IonTitle>Add Class</Ionic.IonTitle>

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
          <Ionic.IonLabel>Name of class: </Ionic.IonLabel>
          <Ionic.IonInput id="title"></Ionic.IonInput>
          <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Description: </Ionic.IonLabel>
          <Ionic.IonInput id="notes"></Ionic.IonInput>
          <br />
        </Ionic.IonItem>

        <Ionic.IonItem>
          <Ionic.IonLabel>Class time: </Ionic.IonLabel>
          <Ionic.IonDatetime
            id="date"
            min="2020"
            max="2040"
            displayFormat="MMM DD, YYYY hh:mm A"
          ></Ionic.IonDatetime>
        </Ionic.IonItem>

        <Ionic.IonAlert 
          isOpen={showAlert}
          onDidDismiss={() => {setShowAlert(false)}}
          header={"Are you sure you want to book?"}
          message={`You have a class at this time:\n ${intersectingClasses[0].title}`}
          buttons={[
            {
              text: "Cancel",
                role: "cancel",
                handler: () => {
                  console.log(intersectingClasses);
                  setShowAlert(false);
                }
            },
            {
              text: "OK",
              handler: () => {
                var title = document.getElementById("title").value;
                var date = document.getElementById("date").value;
                var notes = document.getElementById("notes").value; 
                scheduleNotification(title, date, notes);
              }
            }
          ]}
        />

        <Ionic.IonButton
          expand="full"
          onClick={async () => {
            var title = document.getElementById("title").value;
            var date = document.getElementById("date").value;
            var notes = document.getElementById("notes").value; 
            date = Date.parse(date);

            if () {
              var { value } = await Storage.get({ key: "events" })
              value = JSON.parse(value);
              if (value == null) {
                value = {};
                value.projects = [];
                value.classes = [];
              };
              var exceptions = [];
              value.classes.forEach(element => {
                console.log(element.date);
                console.log(date);
                var test = element.date - date;
                if (test >= -7200000 && test <= 7200000) {
                  exceptions.push(element);
                } 
              })
              if (exceptions.length == 0) {
                value.classes.push({title: title, date: date});
                console.log(exceptions);
                date = new Date(date);
                console.log(date);
                const notifs = await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: title,
                      body: notes,
                      id: 1,
                      schedule: { at: date },
                      sound: null,
                      attachments: null,
                      actionTypeId: "",
                      extra: null
                    }
                  ]
                })
                await Storage.set({key: "events", value: JSON.stringify(value)})
              } else {
                setIntersectingClasses(exceptions);
                console.log(exceptions);
                setShowAlert(true);
              }
            }}
          }
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
