import React, { useState } from "react";
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

export default function EditClass(props) {
  const [showAlert, setShowAlert] = useState(false);
  const [intersectingClasses, setIntersectingClasses] = useState(["test"]);
  const [recurring, setRecurring] = useState(false);
  const [showFieldAlert, setShowFieldAlert] = useState(false);
  const [person, setPerson] = useState("");
  const [errMsg, setErrMsg] = useState("");
  getPeople();
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
          <Ionic.IonInput id="title"></Ionic.IonInput> <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Description: </Ionic.IonLabel>
          <Ionic.IonInput id="notes"></Ionic.IonInput> <br />
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
        <Ionic.IonButton
          expand="full"
          onClick={async () => {
            var title = document.getElementById("title").value;
            var date = document.getElementById("date").value;
            var notes = document.getElementById("notes").value;
            var endtime = document.getElementById("enddate").value;
            var { value } = await Storage.get({ key: "events" });
            value = JSON.parse(value);
            var id = await Storage.get({ key: "nextid" });
            id = parseInt(id.value);

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
            console.log(exceptions.length === 0);
            if (exceptions.length === 0) {
              console.log(props.id);
              var toCancel = {
                notifications: [{ id: props.id }],
              };

              await LocalNotifications.cancel(toCancel);
              var obj = value.classes.find((el) => el.id === props.id);
              var idx = value.classes.indexOf(obj);
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

              const notifs = await LocalNotifications.schedule({
                notifications: [
                  {
                    title: `${person} - ${title}`,
                    body: notes,
                    id: id,
                    schedule: { at: new Date(date) },
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
            } else {
              await Modals.alert({
                title: "Some classes intersect with this",
              });
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
