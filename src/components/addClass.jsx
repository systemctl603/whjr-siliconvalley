import React from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";

export default function AddClassMenu(props) {
  return (
    <Ionic.IonModal
      isOpen={props.hook}
      cssClass="childMenu"
      onDidDismiss={() => props.hookChange(false)}
    >
      <Ionic.IonToolbar>
        <Ionic.IonTitle>Add Class</Ionic.IonTitle>
        <hr />
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
          <Ionic.IonInput id="input"></Ionic.IonInput>
          <br />
        </Ionic.IonItem>
        <Ionic.IonItem>
          <Ionic.IonLabel>Description: </Ionic.IonLabel>
          <Ionic.IonInput id="notes"></Ionic.IonInput>
          <br />
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

        <Ionic.IonButton
          expand="full"
          onClick={() => {
            var input = document.getElementById("input").value;
            var date = document.getElementById("date").value;
            var notes = document.getElementById("notes").value; 
            props.callback(input, date, notes);
          }}
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
