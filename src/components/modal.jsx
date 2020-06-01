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
      <form slot="start" id="form">
        <Ionic.IonItem lines="full">
          <Ionic.IonLabel>{props.name}</Ionic.IonLabel>
          <Ionic.IonInput
            onChange={(e) => {
              if (typeof props.hook2 == Function) {
                props.hook2(e.target.value);
              }
            }}
          ></Ionic.IonInput>
          <br />
        </Ionic.IonItem>
        {datetime}
        <Ionic.IonButton
          expand="full"
          onClick={() => {
            props.callback();
          }}
        >
          Submit
        </Ionic.IonButton>
      </form>
    </Ionic.IonModal>
  );
}
