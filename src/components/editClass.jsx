import React, { useState, useEffect } from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import { Plugins } from "@capacitor/core";
const { Storage, LocalNotifications, Modals } = Plugins;
var peoplearr = [];
async function getPeople() {
  var { value } = await Storage.get({ key: "people" });
  if (value !== null) {
    peoplearr = JSON.parse(value);
  } else {
    peoplearr = [];
  }
}

async function getValues(id) {
  var { value } = await Storage.get({ key: "events" });
  value = JSON.parse(value);
  if (value === null) {
    value = {};
    value.projects = [];
    value.classes = [];
  }

  var properties = value.classes.find((el) => el.id === id);
  if (properties) {
    return properties;
  } else {
    return {};
  }
}
export default function EditClass(props) {
  const [person, setPerson] = useState("");
  const [defval, setDefval] = useState({
    name: "",
    date: new Date("1/1/1970").toISOString(),
    notes: "",
    endtime: new Date("1/1/1970").toISOString(),
  });
  useEffect(() => {
    getValues(props.id).then((res) => setDefval(res));
    setPerson(defval.person);
  }, [props.id]);
  getPeople();
  const scheduleNotification = async (title, date, notes, person, endtime) => {
    var { value } = await Storage.get({ key: "events" });
    var id = (await Storage.get({ key: "nextid" })).value;
    id === null ? (id = 1) : (id = parseInt(id));

    var endtime = new Date(endtime);
    var date = new Date(date);

    endtime.setFullYear(date.getFullYear());
    endtime.setMonth(date.getMonth());
    endtime.setDate(date.getDate());

    value = JSON.parse(value);
    date = new Date(date);

    console.log(`${endtime} \n ${date}`);
    console.log(props.id);
    var toCancel = {
      notifications: [{ id: props.id }],
    };

    await LocalNotifications.cancel(toCancel);
    var obj = value.classes.find((el) => el.id === props.id);
    var idx = value.classes.indexOf(obj);
    console.trace(obj, idx);
    value.classes.splice(idx, 1);

    endtime = new Date(endtime);

    value.classes.push({
      title: title,
      date: date,
      notes: notes,
      endtime: endtime.toISOString(),
      person: person,
      id: id,
    });
    var d = new Date(date);
    d.setHours(d.getHours() - 1);
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: `${person} - ${title}`,
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

    id++;
    await Storage.set({
      key: "nextid",
      value: id.toString(),
    });
    console.log(value);
    await Storage.set({
      key: "events",
      value: JSON.stringify(value),
    });
    props.callback();
  };
  return (
    <Ionic.IonModal
      isOpen={props.hook}
      cssClass="childMenu"
      onDidDismiss={() => props.hookChange(false)}
    >
      <Ionic.IonToolbar>
        <Ionic.IonTitle>Edit Class</Ionic.IonTitle>
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
          <Ionic.IonInput id="title" value={defval.title}></Ionic.IonInput>
          <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Description: </Ionic.IonLabel>
          <Ionic.IonInput id="notes" value={defval.notes}></Ionic.IonInput>
          <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Event time: </Ionic.IonLabel>
          <Ionic.IonDatetime
            id="date"
            min="2020"
            max="2040"
            value={defval.date}
            displayFormat="MMM DD hh:mm A"
          ></Ionic.IonDatetime>
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>End time: </Ionic.IonLabel>
          <Ionic.IonDatetime
            id="enddate"
            min="2020"
            max="2040"
            value={defval.endtime}
            displayFormat="MMM DD hh:mm A"
          ></Ionic.IonDatetime>
        </Ionic.IonItem>

        <Ionic.IonItem>
          <Ionic.IonLabel>Year (Optional for current year):</Ionic.IonLabel>
          <Ionic.IonDatetime
            id="year"
            min={new Date().toISOString()}
            max="2040"
            value={defval.endtime}
            displayFormat="YYYY"
          ></Ionic.IonDatetime>
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Person: </Ionic.IonLabel>
          <Ionic.IonSelect
            value={defval.person}
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

            var title = document.getElementById("title").value;
            var date = document.getElementById("date").value;
            var notes = document.getElementById("notes").value;
            var endtime = document.getElementById("enddate").value;
            var year = document.getElementById("year").value;

            year === undefined ? (year = new Date()) : (year = new Date(year));
            date = new Date(date);
            endtime = new Date(endtime);

            date.setFullYear(year.getFullYear());
            endtime.setFullYear(year.getFullYear());

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
            var exceptions = [];
            var { value } = await Storage.get({ key: "events" });
            value = JSON.parse(value);
            if (value === null) {
              value = {};
              value.projects = [];
              value.classes = [];
            }
            value.classes.forEach((element) => {
              console.log(element);
              var eldate = new Date(element.date);
              var elendtime = new Date(element.endtime);

              var foreHour = eldate.getTime() - date;
              var afterHour = elendtime.getTime() - endtime;
              if (
                ((eldate <= date && date <= elendtime) ||
                  (eldate <= endtime && endtime <= elendtime) ||
                  (-3600000 <= foreHour && foreHour <= 3600000) ||
                  (-3600000 <= afterHour && afterHour <= 3600000)) &&
                element.id !== props.id
              ) {
                exceptions.push(element);
              }
              console.log(exceptions);
            });

            if (exceptions.length === 0) {
              console.log(props.id);
              var toCancel = {
                notifications: [{ id: props.id }],
              };

              await LocalNotifications.cancel(toCancel);
              var obj = value.classes.find((el) => el.id === props.id);
              var idx = value.classes.indexOf(obj);
              console.trace(obj, idx);
              value.classes.splice(idx, 1);

              endtime = new Date(endtime);

              value.classes.push({
                title: title,
                date: date,
                notes: notes,
                endtime: endtime.toISOString(),
                person: person,
                id: id,
              });
              var d = new Date(date);
              d.setHours(d.getHours() - 1);
              const notifs = await LocalNotifications.schedule({
                notifications: [
                  {
                    title: `${person} - ${title}`,
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

              id++;
              await Storage.set({
                key: "nextid",
                value: id.toString(),
              });
              console.log(value);
              await Storage.set({
                key: "events",
                value: JSON.stringify(value),
              });
              props.callback();
            } else {
              var res = window.confirm(
                `Some classes intersect with this:\n${exceptions
                  .map(
                    ({ title, date }) =>
                      `${title} on ${new Date(date).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}\n`
                  )
                  .join("")}Do you want to continue?`
              );

              if (res === true) {
                var toCancel = {
                  notifications: [{ id: props.id }],
                };

                await LocalNotifications.cancel(toCancel);
                var obj = value.classes.find((el) => el.id === props.id);
                var idx = value.classes.indexOf(obj);
                console.trace(obj, idx);
                value.classes.splice(idx, 1);

                endtime = new Date(endtime);

                value.classes.push({
                  title: title,
                  date: date,
                  notes: notes,
                  endtime: endtime.toISOString(),
                  person: person,
                  id: id,
                });
                var d = new Date(date);
                d.setHours(d.getHours() - 1);
                const notifs = await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: `${person} - ${title}`,
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

                id++;
                await Storage.set({
                  key: "nextid",
                  value: id.toString(),
                });
                console.log(value);
                await Storage.set({
                  key: "events",
                  value: JSON.stringify(value),
                });
              }
              props.callback();
            }
          }}
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
