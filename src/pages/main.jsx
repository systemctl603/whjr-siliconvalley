import React from "react";
import { useState } from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import "./main.css";
import AddPersonMenu from "../components/addPerson";
import AddClassMenu from "../components/addClass";
import AddProjectMenu from "../components/addProject"
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addPerson, getPersons } from "../App";

const {Storage} = Plugins;

var pendingarr = [];
async function getPending() {
  var tmparr = (await Storage.get({key: "events"})).value;
  tmparr = JSON.parse(tmparr)
  pendingarr = tmparr.classes
}
getPending();

function HomePage() {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAddChildMenu, setShowAddChildMenu] = useState(false);
  const [childInName, setChildInName] = useState("");
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [dateClicked, setDateClicked] = useState(new Date());
  getPending();
  const Buttons = [
    {
      text: "Delete",
      role: "destructive",
      icon: Icons.trash,
      handler: () => {
        console.log("test")
      },
    },
    {
      text: "Remove All Children",
      role: "destructive",
      icon: Icons.trash,
      handler: () => {
        console.log("TEst");
      },
    },
    {
      text: "Add child",
      icon: Icons.bodyOutline,
      handler: () => {
        setShowAddChildMenu(true);
      },
    },
    {
      text: "Add class",
      icon: Icons.calendarOutline,
      handler: () => {
        setShowAddClass(true);
      },
    },
    {
      text: "Add Project",
      icon: Icons.briefcaseOutline,
      handler: () => {
        setShowAddProject(true);
      },
    },
    {
      text: "Cancel",
      icon: Icons.close,
      role: "cancel",
    },
  ];

  return (
    <Ionic.IonPage>
      <Ionic.IonHeader>
        <Ionic.IonToolbar>
          <Ionic.IonTitle>Home</Ionic.IonTitle>
        </Ionic.IonToolbar>
      </Ionic.IonHeader>
      <div class="calendar">
        <Calendar onChange={setDateClicked}/>
      </div>
      {pendingarr.map(element => {
        var date = new Date(element.date);
        console.log(date, dateClicked)
        if (dateClicked.toDateString() === date.toDateString()) {
          return (
            <Ionic.IonItem>
              <Ionic.IonLabel>{element.title}</Ionic.IonLabel>
              <Ionic.IonLabel>{date.toDateString()}</Ionic.IonLabel>
            </Ionic.IonItem>
          );
        }
      })}
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
          callback={(x) => {
            addPerson(x);
            setShowAddChildMenu(false);
          }}
        />

        <AddClassMenu
          hook={showAddClass}
          hookChange={(val) => setShowAddClass(val)}
          callback={(title, date, notes) => {
            setShowAddClass(false);
          }}
        />
        <AddProjectMenu
          hook={showAddProject}
          hookChange={(val) => setShowAddProject(val)}
          callback={() => {
            setShowAddProject(false);
          }}
        />
      </Ionic.IonContent>
    </Ionic.IonPage>
  );
}
export default HomePage;
