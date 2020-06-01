import React from "react";
import { useState } from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import "./main.css";
import ModalTemplate from "../components/modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addChild, getChilds } from "../App";

function HomePage() {
  addChild("Hello");
  getChilds();
  const { Storage, StatusBar } = Plugins;
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAddChildMenu, setShowAddChildMenu] = useState(false);
  const [childInName, setChildInName] = useState("");
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  StatusBar.hide();
  const Buttons = [
    {
      text: "Delete",
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
  async function storeChild(keyval, jsonvalue) {
    await Storage.set({
      key: keyval,
      value: JSON.stringify(jsonvalue),
    });
  }

  async function getChildNum() {
    var x = await Storage.get({ key: "childIndex" });
    console.log(x);
  }

  function handleChange(event) {
    setChildInName(event.target.value);
  }

  return (
    <Ionic.IonPage>
      <Ionic.IonHeader>
        <Ionic.IonToolbar>
          <Ionic.IonTitle>Home</Ionic.IonTitle>
        </Ionic.IonToolbar>
      </Ionic.IonHeader>
      <div class="calendar">
        <Calendar />
      </div>
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

        <ModalTemplate
          hook={showAddChildMenu}
          hookChange={(val) => setShowAddChildMenu(val)}
          name="Child Name:"
          title={childInName}
          callback={() => {
            setShowAddChildMenu(false);
          }}
        />

        <ModalTemplate
          hook={showAddClass}
          hookChange={(val) => setShowAddClass(val)}
          hook2={(val) => setChildInName(val)}
          name="Class Name:"
          showDate="true"
          datename="Due Date"
          title="Add Class"
          callback={() => {
            setShowAddClass(false);
          }}
        />
        <ModalTemplate
          hook={showAddProject}
          hookChange={(val) => setShowAddProject(val)}
          name="Project Desc:"
          showDate="true"
          datename="Due Date"
          title="Add Project"
          inputType="textarea"
          callback={() => setShowAddProject(false)}
        />
      </Ionic.IonContent>
    </Ionic.IonPage>
  );
}
export default HomePage;
