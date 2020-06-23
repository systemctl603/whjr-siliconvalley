import React from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";

export default function AddPersonMenu(props) {
  return (
    <Ionic.IonModal
      isOpen={props.hook}
      cssClass="childMenu"
      onDidDismiss={() => props.hookChange(false)}
    >
      <Ionic.IonToolbar>
        <Ionic.IonTitle>Add Person</Ionic.IonTitle>
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
          <Ionic.IonLabel>First Name: </Ionic.IonLabel>
          <Ionic.IonInput id="input"></Ionic.IonInput>
          <br />
        </Ionic.IonItem>
        <Ionic.IonButton
          expand="full"
          onClick={() => {
            var x = document.getElementById("input").value;
            props.callback(x);
          }}
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
