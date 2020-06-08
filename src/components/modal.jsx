import React from "react";
import * as Ionic from "@ionic/react";
import * as Icons from "ionicons/icons";

export default function ModalTemplate(props) {
  var datetime;
  if (props.showDate == "true") {
    datetime = (
      <Ionic.IonItem>
        <Ionic.IonLabel>{props.datename}</Ionic.IonLabel>
        <Ionic.IonDatetime
          min="2000"
          max="2040"
          displayFormat="DDD. MMM DD, YY"
        ></Ionic.IonDatetime>
      </Ionic.IonItem>
    );
  }
  return (
    <Ionic.IonModal
      isOpen={props.hook}
      cssClass="childMenu"
      onDidDismiss={() => props.hookChange(false)}
    >
      <Ionic.IonToolbar>
        <Ionic.IonTitle>{props.title}</Ionic.IonTitle>
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
          <Ionic.IonLabel>{props.name}</Ionic.IonLabel>
          <Ionic.IonInput id="input"></Ionic.IonInput>
          <br />
        </Ionic.IonItem>
        {datetime}
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
