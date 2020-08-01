import React, { useState } from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import { Plugins } from "@capacitor/core";

const { Storage, LocalNotifications, Modals } = Plugins;
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var peoplearr = [];
async function getPeople() {
  var { value } = await Storage.get({ key: "people" });
  if (value !== null) {
    peoplearr = JSON.parse(value);
  } else {
    peoplearr = [];
  }
}

export default function AddRecurringClass(props) {
  const [person, setPerson] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [months, setMonths] = useState(1);
  const scheduleNotification = async (title, date, notes, person, endtime) => {
    var { value } = await Storage.get({ key: "events" });

    var id = (await Storage.get({ key: "nextid" })).value;
    var recurringId = (await Storage.get({ key: "recurringid" })).value;
    id === null ? (id = 1) : (id = parseInt(id));
    recurringId === null ? (recurringId = 1) : (recurringId = parseInt(id));

    var endtime = new Date(endtime);

    if (value !== null) {
      value = JSON.parse(value);
    } else {
      value = {};
      value.projects = [];
      value.classes = [];
    }
    date = new Date(date);
    value.classes.push({
      title: title,
      date: date,
      notes: notes,
      endtime: endtime,
      person: person,
      id: id,
    });
    var d = new Date(date);
    d.setHours(d.getHours() - 1);
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: notes,
          id: id,
          schedule: { at: d },
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null,
        },
      ],
    });
    id += 1;
    await Storage.set({ key: "events", value: JSON.stringify(value) });
    await Storage.set({ key: "nextid", value: id.toString() });
    props.callback();
  };
  getPeople();
  return (
    <Ionic.IonModal
      isOpen={props.hook}
      cssClass="childMenu"
      onDidDismiss={() => props.hookChange(false)}
    >
      <Ionic.IonToolbar>
        <Ionic.IonTitle>Add Event</Ionic.IonTitle>
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
          <Ionic.IonInput id="title"></Ionic.IonInput> <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Description: </Ionic.IonLabel>
          <Ionic.IonInput id="notes"></Ionic.IonInput> <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel onIonChange={(e) => setDayOfWeek(e.detail.value)}>
            Day of Week:
          </Ionic.IonLabel>
          <Ionic.IonSelect>
            {daysOfWeek.map((element) => {
              return (
                <Ionic.IonSelectOption value={element}>
                  {element}
                </Ionic.IonSelectOption>
              );
            })}
          </Ionic.IonSelect>
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Number of months</Ionic.IonLabel>
          <Ionic.IonSelect
            onIonChange={(e) => setMonths(parseInt(e.detail.value))}
          >
            {["1", "2", "3"].map((element) => {
              return (
                <Ionic.IonSelectOption value={element}>
                  {element}
                </Ionic.IonSelectOption>
              );
            })}
          </Ionic.IonSelect>
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Person: </Ionic.IonLabel>
          <Ionic.IonSelect
            onIonChange={(e) => {
              setPerson(e.detail.value);
            }}
          >
            {peoplearr.map((element) => {
              return (
                <Ionic.IonSelectOption value={element}>
                  {element}
                </Ionic.IonSelectOption>
              );
            })}
          </Ionic.IonSelect>
        </Ionic.IonItem>
        <Ionic.IonButton
          expand="full"
          onClick={async () => {
            var id = (await Storage.get({ key: "nextid" })).value;
            id === null ? (id = 1) : (id = parseInt(id));

            var recurringid = (await Storage.get({ key: "recurringid" })).value;
            recurringid === null
              ? (recurringid = 1)
              : (recurringid = parseInt(recurringid));

            var title = document.getElementById("title").value;
            var date = document.getElementById("date").value;
            var notes = document.getElementById("notes").value;
            var endtime = document.getElementById("enddate").value;

            var getDaysArray = function (s, e) {
              for (
                var a = [], d = new Date(s);
                d <= e;
                d.setDate(d.getDate() + 1)
              ) {
                a.push(new Date(d));
              }
              return a;
            };
            var currentDate = new Date();
            var endDate = new Date().setHours(currentDate.getHours() + months);
            var daysArray = getDaysArray(currentDate, endDate);

            var filteredArray = daysArray.filter((el) => {
              if (daysOfWeek[el.getDay()] === dayOfWeek) {
                return true;
              } else {
                return false;
              }
            });

            if (
              title === "" ||
              person === "" ||
              endtime === undefined ||
              date === undefined
            ) {
              await Modals.alert({
                message: "Some fields are empty",
              });
              return;
            } else if (new Date(date) < new Date()) {
              await Modals.alert({
                message: "Date is invalid",
              });
              return;
            } else if (new Date(endtime) <= new Date(date)) {
              await Modals.alert({
                message: "Endtime is before start",
              });
              return;
            }
            for (var date in filteredArray) {
              var { value } = await Storage.get({ key: "events" });
              value = JSON.parse(value);
              if (value === null) {
                value = {};
                value.projects = [];
                value.classes = [];
              }
              var exceptions = [];

              value.classes.forEach((element) => {
                var eldate = new Date(element.date);
                var elendtime = new Date(element.endtime);

                var foreHour = eldate.getTime() - date;
                var afterHour = elendtime.getTime() - endtime;
                if (
                  (eldate <= date && date <= elendtime) ||
                  (eldate <= endtime && endtime <= elendtime) ||
                  (-3600000 <= foreHour && foreHour <= 3600000) ||
                  (-3600000 <= afterHour && afterHour <= 3600000)
                ) {
                  exceptions.push(element);
                }
                console.log(exceptions);
              });

              if (exceptions.length <= 0) {
                value.classes.push({
                  title: title,
                  date: date,
                  notes: notes,
                  endtime: endtime.toISOString(),
                  person: person,
                  id: id,
                });

                console.log(exceptions);
                date = new Date(date);
                console.log(date);

                const notifs = await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: title,
                      body: notes,
                      id: id,
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

                id += 1;
                await Storage.set({ key: "nextid", value: id.toString() });

                props.callback();
              }
            }
          }}
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
