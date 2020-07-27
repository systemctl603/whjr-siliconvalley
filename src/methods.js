import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export default async function filterEvents() {
  const fetchEvents = async () => {
    var { value } = await Storage.get({ key: "events" });
    if (value === null) {
      var val = {};
      val.projects = [];
      val.classes = [];
      console.log(val);
      value = val;
      await Storage.set({
        key: "events",
        value: JSON.stringify(val),
      });
      return;
    }
    var eventobj = JSON.parse(value);
    console.log(eventobj);
    return eventobj;
  };
  fetchEvents().then(async (events) => {
    Object.keys(events).forEach((key) => {
      events[key].forEach((element) => {
        if (key === "classes") {
          var edate = new Date(element.endtime);
          if (edate <= new Date()) {
            var idx = events[key].indexOf(element);
            if (idx > -1) {
              var tmp = events[key].splice(idx, 1);
              console.log(`removed ${tmp}`);
            }
          }
        } else if (key === "projects") {
          var date = new Date(element.date);
          if (date <= new Date()) {
            var idx = events[key].indexOf(element);
            if (idx > -1) {
              events[key].splice(idx, 1);
            }
          }
        }
      });
      console.log(events);
    });
    await Storage.set({ key: "events", value: JSON.stringify(events) });
  });
  return "finished";
}
