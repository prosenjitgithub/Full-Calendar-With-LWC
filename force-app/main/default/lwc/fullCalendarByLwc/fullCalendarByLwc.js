import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import FullCalendarPlugin from "@salesforce/resourceUrl/FullCalendarResource";
import getAppointments from "@salesforce/apex/MyCalendarController.getMyAppointments";

export default class FullCalendarByLwc extends NavigationMixin(LightningElement) {
    isResourceLoaded = false;

    // Redercallback method will load FullCalendar Plugin Javascripts and CSS.
    renderedCallback() {
        if (this.isResourceLoaded) {
            return;
        }

        this.isResourceLoaded = true;

        Promise.all([
            loadStyle(this, FullCalendarPlugin + "/packages/core/main.css"),
            loadScript(this, FullCalendarPlugin + "/packages/core/main.js"),
        ])
            .then(() => {
                Promise.all([
                    loadStyle(this, FullCalendarPlugin + "/packages/daygrid/main.css"),
                    loadScript(this, FullCalendarPlugin + "/packages/daygrid/main.js"),
                ])
                    .then(() => {
                        Promise.all([
                            loadStyle(
                                this,
                                FullCalendarPlugin + "/packages/timegrid/main.css"
                            ),
                            loadScript(
                                this,
                                FullCalendarPlugin + "/packages/timegrid/main.js"
                            ),
                        ])
                            .then(() => {
                                this.getAppointmentsFromServer();
                            })
                            .catch((error) => {
                                console.error({
                                    message: "Error occured loading daygrid",
                                    error,
                                });
                            });
                    })
                    .catch((error) => {
                        console.error({ message: "Error occured loading timegrid", error });
                    });
            })
            .catch((error) => {
                console.error({
                    message: "Error occured on loading core files",
                    error,
                });
            });
    }

    getAppointmentsFromServer() {
        getAppointments()
            .then((result) => {
                this.generateEventJson(result);
            })
            .catch((error) => {
                console.error({
                    message: "Error occured on getCalendarEventsFromServer",
                    error,
                });
            });
    }

    generateEventJson(result) {
        let eventList = [];
        result.forEach((event) => {
            eventList.push({
                id: event.recordId,
                start: event.startTime,
                end: event.endTime,
                title: event.name,
            });
        });
        this.initCalendar(eventList);
    }

    initCalendar(eventList) {
        let self = this;
        const calendarEl = this.template.querySelector("div.fullcalendar");
        let calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: ["timeGrid", "dayGrid"],
            defaultView: "timeGridDay",
            height: "parent",
            header: {
                left: "prev, next",
                center: "title",
                right: "today timeGridDay, timeGridWeek, dayGridMonth",
            },
            events: eventList,
            titleFormat: { month: "short", day: "numeric", year: "numeric" },
            eventClick: function (info) {
                alert('fff');
                self[NavigationMixin.Navigate]({
                    type: "standard__recordPage",
                    attributes: {
                        recordId: info.event.id,
                        actionName: "view",
                    },
                });
            },
        });
        calendar.render();
    }
}
