import React, { useState } from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import { Plugins } from "@capacitor/core";

const { Storage, LocalNotifications } = Plugins;

var peoplearr = [];
async function getPeople() {
  var { value } = await Storage.get({ key: "people" });
  if (value !== null) {
    peoplearr = JSON.parse(value);
  } else {
    peoplearr = [];
  }
}

export default function AddClassMenu(props) {
  const [person, setPerson] = useState("");
  const scheduleNotification = async (title, date, notes, person, endtime) => {
    var { value } = await Storage.get({ key: "events" });
    var id = (await Storage.get({ key: "nextid" })).value;
    id === null ? (id = 1) : (id = parseInt(id));

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
          <Ionic.IonLabel>Name of event: </Ionic.IonLabel>
          <Ionic.IonInput id="title"></Ionic.IonInput> <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Description: </Ionic.IonLabel>
          <Ionic.IonInput id="notes"></Ionic.IonInput> <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Event time: </Ionic.IonLabel>
          <Ionic.IonDatetime
            id="date"
            min="2020"
            max="2040"
            displayFormat="MMM DD, hh:mm A"
          ></Ionic.IonDatetime>
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>End time: </Ionic.IonLabel>
          <Ionic.IonDatetime
            id="enddate"
            min="2020"
            max="2040"
            displayFormat="MMM DD, hh:mm A"
          ></Ionic.IonDatetime>
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Year (Optional for current year):</Ionic.IonLabel>
          <Ionic.IonDatetime
            id="year"
            min={new Date().toISOString()}
            max="2040"
            displayFormat="YYYY"
          ></Ionic.IonDatetime>
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
            console.log(id);
            var title = document.getElementById("title").value;
            var date = document.getElementById("date").value;
            var notes = document.getElementById("notes").value;
            var endtime = document.getElementById("enddate").value;
            var year = document.getElementById("year").value;
            year === undefined ? (year = new Date()) : (year = new Date(year));

            console.log(date);
            date = new Date(date);
            endtime = new Date(endtime);

            if (
              title === "" ||
              person === "" ||
              endtime === undefined ||
              date === undefined
            ) {
              window.alert("Some fields are empty");
              return;
            } else if (new Date(date) < new Date()) {
              window.alert("Date is not valid");
              return;
            } else if (new Date(endtime) <= new Date(date)) {
              window.alert("Endtime is before start");
              return;
            } else if (endtime.getTime() - date.getTime() > 9800000) {
              var res = window.confirm(
                "The duration seems to be greater than 3 hours. Confirm?"
              );
              if (!res) return;
            }

            date.setFullYear(year.getFullYear());
            endtime.setFullYear(year.getFullYear());

            console.log(date, endtime);
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
              await Storage.set({
                key: "events",
                value: JSON.stringify(value),
              });
              id += 1;
              await Storage.set({ key: "nextid", value: id.toString() });
              props.callback();
            } else {
              var res = window.confirm(
                `Do you want to conttinue booking? \nConflicts:\n${exceptions
                  .map(({ title, date }) => {
                    return `${title} on ${new Date(date).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}\n`;
                  })
                  .join("")}`
              );
              if (res) {
                scheduleNotification(title, date, notes, person, endtime);
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
