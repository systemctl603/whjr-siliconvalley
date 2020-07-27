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
  const [showAlert, setShowAlert] = useState(false);
  const [intersectingClasses, setIntersectingClasses] = useState(["test"]);
  const [recurring, setRecurring] = useState(false);
  const [showFieldAlert, setShowFieldAlert] = useState(false);
  const [person, setPerson] = useState("");
  const [errMsg, setErrMsg] = useState("");
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
            displayFormat="MMM DD, YYYY hh:mm A"
          ></Ionic.IonDatetime>
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>End time: </Ionic.IonLabel>
          <Ionic.IonDatetime
            id="enddate"
            min="2020"
            max="2040"
            displayFormat="hh:mm A"
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
        <Ionic.IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
          }}
          header={"Are you sure you want to book?"}
          message={`You have a class at this time:\n ${intersectingClasses.map(
            (element) => {
              return `${element.title} on ${new Date(
                element.date
              ).toLocaleString()}`;
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
                var endtime = document.getElementById("enddate").value;
                scheduleNotification(title, date, notes, person, endtime);
              },
            },
          ]}
        />
        <Ionic.IonAlert
          isOpen={showFieldAlert}
          onDidDismiss={() => {
            setShowFieldAlert(false);
          }}
          header={errMsg}
          buttons={[
            {
              text: "OK",
              handler: () => {
                setShowFieldAlert(false);
              },
            },
          ]}
        />
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
            console.log(date);
            date = new Date(date);
            endtime = new Date(endtime);
            endtime.setFullYear(date.getFullYear());
            endtime.setMonth(date.getMonth());
            endtime.setDate(date.getDate());

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
            }
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
              date = new Date(date);
              var d = date;
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
                `You have a class at this time:\n${exceptions
                  .map(({ title, date }) => {
                    return `${title} on ${new Date(date).toLocaleString()}\n`;
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
