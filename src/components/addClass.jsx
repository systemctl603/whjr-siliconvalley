import React, { useState } from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import { getDaysBetween } from "../App";

const { Storage, LocalNotifications } = Plugins;

var peoplearray = [];
async function getPeople() {
  var { value } = await Storage.get({ key: "people" });
  value = JSON.parse(value);
  console.log(value);
  if (value === null) {
    peoplearray = ["No People Available"];
  } else {
    peoplearray = value;
  }
}
export default function AddClassMenu(props) {
  const [showAlert, setShowAlert] = useState(false);
  const [intersectingClasses, setIntersectingClasses] = useState(["test"]);
  const [personarr, setPersonarr] = useState(["Fetching Results"]);
  const [person, setPerson] = useState("");
  const [showRecurring, setShowRecurring] = useState(false);
  const [recurring, setRecurring] = useState(false);
  getPeople();

  // Storage.get({ key: "people" })
  //   .then((res) => {console.log(JSON.stringify(res.json))})

  const showExceptions = () => {
    setShowAlert(true);
  };

  const scheduleNotification = async (title, date, notes) => {
    date = new Date(date);
    var { value } = await Storage.get({ key: "events" });
    value = JSON.parse(value);
    value.classes.push({ title: title, date: date });
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
          extra: null,
        },
      ],
    });
    await Storage.set({ key: "events", value: JSON.stringify(value) });
  };

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
          <Ionic.IonLabel>Recurring: </Ionic.IonLabel>
          <Ionic.IonToggle
            id="recurrence"
            slot="end"
            color="primary"
            checked={recurring}
            onIonChange={(e) => setRecurring(e.detail.checked)}
          ></Ionic.IonToggle>
        </Ionic.IonItem>

        <Ionic.IonItem>
          <Ionic.IonLabel>
            {!recurring ? "Class Time: " : "Start Date: "}
          </Ionic.IonLabel>
          <Ionic.IonDatetime
            id="date"
            min="2020"
            max="2040"
            displayFormat={!recurring ? "MMM DD, YYYY hh:mm A" : "MMM DD, YYYY"}
          ></Ionic.IonDatetime>
        </Ionic.IonItem>

        <Ionic.IonItem>
          <Ionic.IonLabel>
            {!recurring ? "End Time: " : "End Date: "}
          </Ionic.IonLabel>
          <Ionic.IonDatetime
            id="endtime"
            min="2020"
            max="2040"
            displayFormat={!recurring ? "hh:mm A" : "MMM DD, YYYY"}
          ></Ionic.IonDatetime>
        </Ionic.IonItem>

        <Ionic.IonItem>
          <Ionic.IonLabel>Person</Ionic.IonLabel>
          <Ionic.IonSelect onIonChange={(e) => setPerson(e.detail.value)}>
            {peoplearray.map((element) => {
              if (element != "No People Available") {
                console.log(element);
                return <Ionic.IonSelectOption>{element}</Ionic.IonSelectOption>;
              } else {
                console.log(element);
                return (
                  <Ionic.IonSelectOption disabled>
                    {element}
                  </Ionic.IonSelectOption>
                );
              }
            })}
          </Ionic.IonSelect>
        </Ionic.IonItem>

        <Ionic.IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
          }}
          header={"Are you sure you want to book?"}
          message={`You have a class at this time:\n ${intersectingClasses.map(
            (element) => {
              return `${element.title}`;
            }
          )}`}
          buttons={[
            {
              text: "Cancel",
                role: "cancel",
                handler: () => {
                  console.log(intersectingClasses);
                  setShowAlert(false);
                },
            },
            {
              text: "OK",
              handler: () => {
                var title = document.getElementById("title").value;
                var date = document.getElementById("date").value;
                var notes = document.getElementById("notes").value;
                scheduleNotification(title, date, notes);
              },
            },
          ]}
        />

        <Ionic.IonButton
          expand="full"
          onClick={async () => {
            var title = document.getElementById("title").value;
            var date = document.getElementById("date").value;
            var notes = document.getElementById("notes").value;
            var endtime = document.getElementById("endtime").value;

            date = new Date(date);
            endtime = new Date(endtime);

            if (!recurring) {
              endtime.setDate(date.getDate());
              endtime.setFullYear(date.getFullYear());
              endtime.setMonth(date.getMonth());

              var { value } = await Storage.get({ key: "events" });
              value = JSON.parse(value);
              if (value == null) {
                value = {};
                value.projects = [];
                value.classes = [];
              }
              var exceptions = [];
              value.classes.forEach((element) => {
                element.date = new Date(element.date);
                element.endtime = new Date(element.endtime);
                console.log(element.date.getTime());
                console.log(date.getTime());
                console.log(element.endtime.getTime());
                if (
                  element.date.getTime() <=
                  date.getTime() <=
                  element.endtime.getTime()
                ) {
                  exceptions.push(element);
                }
              });
              if (exceptions.length == 0) {
                value.classes.push({ title: title, date: date, endtime });
                console.log(exceptions);
                date = new Date(date);
                const notifs = await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: `${person} - ${title}`,
                      body: notes,
                      id: 1,
                      schedule: { at: date },
                      sound: null,
                      attachments: null,
                      actionTypeId: "",
                      extra: null,
                    },
                  ],
                });
                await Storage.set({
                  key: "events",
                  value: JSON.stringify(value),
                });
              } else {
                setIntersectingClasses(exceptions);
                console.log(exceptions);
                setShowAlert(true);
              }
            }
            props.callback();
          }}
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
