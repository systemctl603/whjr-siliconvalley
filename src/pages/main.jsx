import React, { useEffect, useState } from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import "./main.css";
import AddPersonMenu from "../components/addPerson";
import AddClassMenu from "../components/addClass";
import AddProjectMenu from "../components/addProject";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addPerson, getPersons } from "../App";

const { Storage } = Plugins;
var pendingarr = [];

async function updateCardView() {
  var tmparr = (await Storage.get({ key: "events" })).value;
  console.log(tmparr);
  tmparr = JSON.parse(tmparr);
  pendingarr = tmparr.classes;
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
  console.log(pendingarr);
}
updateCardView();
function HomePage() {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAddChildMenu, setShowAddChildMenu] = useState(false);
  const [cardView, setCardView] = useState([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [dateClicked, setDateClicked] = useState(new Date());
  const Buttons = [
    {
      text: "Delete",
      role: "destructive",
      icon: Icons.trash,
      handler: () => {
        console.log("test");
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
    { text: "Cancel", icon: Icons.close, role: "cancel" },
  ];

  return (
    <Ionic.IonPage>
      <Ionic.IonHeader>
        <Ionic.IonToolbar>
          <Ionic.IonTitle>Home</Ionic.IonTitle>
        </Ionic.IonToolbar>
      </Ionic.IonHeader>
      <div class="calendar">
        <Calendar onChange={setDateClicked} value={dateClicked} />
      </div>

      {pendingarr.map((element) => {
        var date = new Date(element.date);
        console.log(date, dateClicked);
        if (dateClicked.toDateString() === date.toDateString()) {
          return (
            <Ionic.IonItem>
              <Ionic.IonLabel>{element.title}</Ionic.IonLabel>
              <Ionic.IonLabel>{date.toLocaleString()}</Ionic.IonLabel>
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
          callback={() => {
            setShowAddClass(false);
            updateCardView();
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
