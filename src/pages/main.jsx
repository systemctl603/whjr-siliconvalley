import React, { useEffect, useState } from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import "./main.css";
import AddPersonMenu from "../components/addPerson";
import AddClassMenu from "../components/addClass";
import AddProjectMenu from "../components/addProject";
import EditClass from "../components/editClass";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ScrollArea from "react-scrollbar";
import { addPerson, getPersons } from "../App";
import { eventNames } from "process";

const { Storage, LocalNotifications, Modals } = Plugins;
var pendingarr = [];
var projectarr = [];

async function updateCardView() {
  var tmparr = (await Storage.get({ key: "events" })).value;
  if (tmparr !== null) {
    tmparr = JSON.parse(tmparr);
    console.log(tmparr);
    pendingarr = tmparr.classes;
    projectarr = tmparr.projects;
    pendingarr.sort((a, b) => {
      var date1 = new Date(a.date);
      var date2 = new Date(b.date);
      if (date1 < date2) {
        return -1;
      } else if (date1 > date2) {
        return 1;
      }
      return 0;
    });
  } else {
    await Storage.set({
      key: "events",
      value: JSON.stringify({
        classes: [],
        projects: [],
      }),
    });
  }
  console.log(pendingarr);
}

var peoplearr = [];

function RemovePerson(props) {
  const [person, setPerson] = useState("");

  async function getPeople() {
    var people = await Storage.get({ key: "people" });
    console.log(people);
    people.value === null ? (people = []) : (people = JSON.parse(people.value));
    console.log(people);
    peoplearr = people;
  }
  getPeople();
  console.log(peoplearr);
  return (
    <Ionic.IonModal
      isOpen={props.hook}
      onDidDismiss={() => {
        props.hookChange(false);
      }}
    >
      <Ionic.IonToolbar>
        <Ionic.IonTitle>Remove Person</Ionic.IonTitle>
      </Ionic.IonToolbar>

      <form id="form">
        <Ionic.IonItem>
          <Ionic.IonLabel>Person to Delete: </Ionic.IonLabel>
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
            if (person === "") {
              await Modals.alert({
                message: "Please fill in the field",
              });
              return;
            }
            var res = await Modals.confirm({
              message: "This will delete all events with this person.",
            });
            if (res.value === true) {
              var peoplearr = JSON.parse(
                (await Storage.get({ key: "people" })).value
              );
              peoplearr.splice(peoplearr.indexOf(person), 1);
              await Storage.set({
                key: "people",
                value: JSON.stringify(peoplearr),
              });
              var events = (await Storage.get({ key: "events" })).value;
              if (events === null) {
                events = {};
                events.classes = [];
                events.projects = [];
              } else {
                events = JSON.parse(events);
              }
              events.classes.forEach(async (element) => {
                if (element.person === person) {
                  events.classes.splice(events.classes.indexOf(element), 1);
                  await LocalNotifications.cancel({
                    notifications: [{ id: element.id }],
                  });
                }
              });
              await Storage.set({
                key: "events",
                value: JSON.stringify(events),
              });
            }
          }}
        >
          Delete
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
function HomePage() {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAddChildMenu, setShowAddChildMenu] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [dateClicked, setDateClicked] = useState(new Date());
  const [showModifMenu, setShowModifMenu] = useState(false);
  const [showPersonMenu, setShowPersonMenu] = useState(false);
  const [editId, setEditId] = useState(1);

  updateCardView();
  const Buttons = [
    {
      text: "Add People",
      icon: Icons.personAddOutline,
      handler: () => {
        setShowAddChildMenu(true);
      },
    },
    {
      text: "Remove People",
      icon: Icons.personRemoveOutline,
      handler: () => {
        setShowPersonMenu(true);
      },
    },
    {
      text: "Add Event",
      icon: Icons.calendarOutline,
      handler: () => {
        setShowAddClass(true);
      },
    },
    {
      text: "Add Reminder",
      icon: Icons.briefcaseOutline,
      handler: () => {
        setShowAddProject(true);
      },
    },
    { text: "Cancel", icon: Icons.close, role: "cancel" },
  ];

  return (
    <Ionic.IonPage>
      <Ionic.IonHeader>
        <Ionic.IonToolbar>
          <Ionic.IonTitle>Home</Ionic.IonTitle>
        </Ionic.IonToolbar>
      </Ionic.IonHeader>
      <Calendar
        className="calendar"
        onChange={setDateClicked}
        value={dateClicked}
      />
      <ScrollArea>
        {pendingarr.map((element) => {
          var date = new Date(element.date);
          var endtime = new Date(element.endtime);
          console.log(date, dateClicked);
          if (dateClicked.toDateString() === date.toDateString()) {
            return (
              <Ionic.IonCard>
                <Ionic.IonCardHeader>
                  <Ionic.IonCardTitle>{element.title}</Ionic.IonCardTitle>
                  <Ionic.IonCardSubtitle>Event</Ionic.IonCardSubtitle>
                </Ionic.IonCardHeader>
                <Ionic.IonCardContent>
                  {date.toLocaleString()} to {endtime.toLocaleString()}
                </Ionic.IonCardContent>
                <Ionic.IonCardContent>{element.notes}</Ionic.IonCardContent>
                <Ionic.IonCardContent>
                  For {element.person}
                </Ionic.IonCardContent>
                <Ionic.IonCardContent>
                  <Ionic.IonButton
                    size="small"
                    onClick={async () => {
                      var toRemove = {
                        notifications: [{ id: element.id }],
                      };
                      await LocalNotifications.cancel(toRemove);
                      var { value } = await Storage.get({ key: "events" });
                      value = JSON.parse(value);

                      var obj = value.classes.find(
                        (el) => el.id === element.id
                      );
                      var idx = value.classes.indexOf(obj);
                      value.classes.splice(idx, 1);
                      console.log(value);
                      var res = await Modals.confirm({
                        title: "Delete",
                        message: "Are you sure you want to delete this",
                      });
                      console.log(res);
                      if (res.value === true) {
                        await Storage.set({
                          key: "events",
                          value: JSON.stringify(value),
                        });
                      }
                      setDateClicked(new Date("1/1/1970"));
                      setTimeout(() => setDateClicked(new Date()), 25);
                    }}
                  >
                    Delete
                  </Ionic.IonButton>
                  <Ionic.IonButton
                    size="small"
                    onClick={() => {
                      setEditId(element.id);
                      setShowEditMenu(true);
                    }}
                  >
                    Edit
                  </Ionic.IonButton>
                </Ionic.IonCardContent>
              </Ionic.IonCard>
            );
          }
        })}

        {projectarr.map((element) => {
          var date = new Date(element.date);
          console.log(date, dateClicked);
          if (dateClicked.toDateString() === date.toDateString()) {
            return (
              <Ionic.IonCard>
                <Ionic.IonCardHeader>
                  <Ionic.IonCardTitle>{element.title}</Ionic.IonCardTitle>
                  <Ionic.IonCardSubtitle>Reminder</Ionic.IonCardSubtitle>
                </Ionic.IonCardHeader>
                <Ionic.IonCardContent>
                  {date.toLocaleString()}
                </Ionic.IonCardContent>
                <Ionic.IonCardContent>
                  <Ionic.IonButton
                    size="small"
                    onClick={async () => {
                      var toRemove = {
                        notifications: [{ id: element.id }],
                      };
                      await LocalNotifications.cancel(toRemove);
                      var { value } = await Storage.get({ key: "events" });
                      value = JSON.parse(value);

                      var obj = value.projects.find(
                        (el) => el.id === element.id
                      );
                      var idx = value.projects.indexOf(obj);
                      value.projects.splice(idx, 1);
                      console.log(value);
                      var res = await Modals.confirm({
                        title: "Delete",
                        message: "Are you sure you want to delete this",
                      });
                      console.log(res);
                      if (res.value === true) {
                        await Storage.set({
                          key: "events",
                          value: JSON.stringify(value),
                        });
                      }
                      setDateClicked(new Date("1/1/1970"));
                      setTimeout(() => setDateClicked(new Date()), 25);
                    }}
                  >
                    Delete
                  </Ionic.IonButton>
                </Ionic.IonCardContent>
              </Ionic.IonCard>
            );
          }
        })}
      </ScrollArea>
      <Ionic.IonContent>
        <Ionic.IonFab vertical="bottom" horizontal="end" slot="fixed">
          <Ionic.IonFabButton onClick={() => setShowActionSheet(true)}>
            <Ionic.IonIcon icon={Icons.add} />
          </Ionic.IonFabButton>
          <Ionic.IonActionSheet
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            cssClass="my-custom-class"
            buttons={Buttons}
          ></Ionic.IonActionSheet>
        </Ionic.IonFab>
        <AddPersonMenu
          hook={showAddChildMenu}
          hookChange={(val) => setShowAddChildMenu(val)}
          callback={async (x) => {
            var { value } = await Storage.get({ key: "people" });
            value = JSON.parse(value);

            console.log(value);
            if (value == null) value = [];
            console.log(value, typeof value);
            var exitStatus = 0;
            value.forEach(async (el) => {
              if (el === x) {
                exitStatus = 1;
                await Modals.alert({
                  message: "Person already exists",
                });
              }
            });
            if (exitStatus !== 1) {
              value.push(x);
              await Storage.set({
                key: "people",
                value: JSON.stringify(value),
              });
            }
            setShowAddChildMenu(false);
          }}
        />
        <AddClassMenu
          hook={showAddClass}
          hookChange={(val) => setShowAddClass(val)}
          callback={() => {
            setShowAddClass(false);
            var prevDate = dateClicked;
            setDateClicked(new Date("1/1/1970"));
            setTimeout(() => setDateClicked(prevDate), 25);
          }}
        />
        <AddProjectMenu
          hook={showAddProject}
          hookChange={(val) => setShowAddProject(val)}
          callback={() => {
            setShowAddProject(false);
          }}
        />

        <EditClass
          hook={showEditMenu}
          hookChange={(val) => setShowEditMenu(val)}
          id={editId}
          callback={() => {
            setShowEditMenu(false);
            var prevDate = dateClicked;
            setDateClicked(new Date("1/1/1970"));
            setTimeout(() => setDateClicked(prevDate), 25);
          }}
        />

        <RemovePerson
          hook={showPersonMenu}
          hookChange={(val) => {
            setShowPersonMenu(val);
          }}
        />
      </Ionic.IonContent>
    </Ionic.IonPage>
  );
}
export default HomePage;
