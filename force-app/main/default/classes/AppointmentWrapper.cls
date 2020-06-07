public with sharing class AppointmentWrapper {
    @AuraEnabled
    public String startTime{get;set;}
    @AuraEnabled
    public String endTime{get;set;}
    @AuraEnabled
    public String status{get;set;}
    @AuraEnabled
    public String name{get;set;}
    @AuraEnabled
    public String recordId{get;set;}

    public AppointmentWrapper(String name, Datetime startTime, Datetime endTime, String status, String recordId) {
        this.name = name;
        this.startTime = String.valueOf(startTime);
        this.endTime = String.valueOf(endTime);
        this.status = status;
        this.recordId = recordId;
    }
}
