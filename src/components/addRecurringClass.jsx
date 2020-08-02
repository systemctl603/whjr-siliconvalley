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

/**
 *
 * @props hook
 * @props hookchange
 * @props callback
 */
export default function AddRecurringClass(props) {
  const [person, setPerson] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [months, setMonths] = useState(5);
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
          <Ionic.IonLabel>Day of Week:</Ionic.IonLabel>
          <Ionic.IonSelect
            onIonChange={(e) => {
              console.log(e);
              setDayOfWeek(e.detail.value);
            }}
          >
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
          <Ionic.IonLabel>Event time: </Ionic.IonLabel>
          <Ionic.IonDatetime
            id="date"
            min="2020"
            max="2040"
            displayFormat="hh:mm A"
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
            var id = (await Storage.get({ key: "nextid" })).value;
            id === null ? (id = 1) : (id = parseInt(id));

            var title = document.getElementById("title").value;
            var date = document.getElementById("date").value;
            var endtime = document.getElementById("enddate").value;
            var notes = document.getElementById("notes").value;
            var { value } = await Storage.get({ key: "events" });
            value = JSON.parse(value);
            if (value === null) {
              value = {};
              value.projects = [];
              value.classes = [];
            }

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
            var endDate = new Date().setMonth(currentDate.getMonth() + months);
            var daysArray = getDaysArray(currentDate, endDate);
            console.log(daysArray);
            console.log(dayOfWeek);

            var filteredArray = daysArray.filter((el) => {
              if (daysOfWeek[el.getDay()] === dayOfWeek) {
                return true;
              } else {
                return false;
              }
            });
            console.log(filteredArray);

            filteredArray = filteredArray.map((el) => {
              var tmp = el;
              tmp.setHours(new Date(date).getHours());
              tmp.setMinutes(new Date(date).getMinutes());

              var tmp2 = new Date(endtime);
              tmp2.setFullYear(tmp.getFullYear());
              tmp2.setMonth(tmp.getMonth());
              tmp2.setDate(tmp.getDate());

              return { date: tmp, endtime: tmp2 };
            });
            console.log(filteredArray);

            if (
              title === "" ||
              person === "" ||
              endtime === undefined ||
              date === undefined ||
              dayOfWeek === "" ||
              months === 5
            ) {
              window.alert("Some fields are empty");
              return;
            } else if (new Date(endtime) <= new Date(date)) {
              window.alert("Endtime is before start");
              return;
            }
            let exceptions = [];

            filteredArray.forEach(({ date, endtime }) => {
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
            });

            if (exceptions.length !== 0) {
              var res = window.confirm(
                `Do you want to continue booking? \n Conflicts\n${exceptions
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
              if (res === false) return;
            }
            filteredArray.forEach(async ({ date, endtime }) => {
              if (date > new Date()) {
                value.classes.push({
                  notes: notes,
                  title: title,
                  date: date,
                  endtime: endtime.toISOString(),
                  person: person,
                  id: id,
                });

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
                id += 1;
              }
            });
            props.callback();
            await Storage.set({
              value: JSON.stringify(value),
              key: "events",
            });
            await Storage.set({ key: "nextid", value: id.toString() });
          }}
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
