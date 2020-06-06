public with sharing class MyCalendarController {
    public static List<AppointmentWrapper> getMyAppointments() {
        List<Appointment__c> appointmentList = [SELECT Name, Start_Time__c, End_Time__c, Status__c 
                                                FROM Appointment__c 
                                                ORDER BY Start_Time__c 
                                                DESC LIMIT 100];
        List<AppointmentWrapper> wrapper = new List<AppointmentWrapper>();
        for(Appointment__c appointment : appointmentList) {
            wrapper.add(new AppointmentWrapper(appointment.Name, 
                                                        appointment.Start_Time__c, 
                                                        appointment.End_Time__c, 
                                                        appointment.Status__c));    
        }
        return wrapper;
    }
}
