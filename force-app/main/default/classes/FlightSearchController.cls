public with sharing class FlightSearchController {
    
    @AuraEnabled(cacheable=true)
    public static List<Airlines__c> getFlightsDetails(String departureFrom, String arrivalTo, String departureDateStr) {
        if (!String.isEmpty(departureFrom) && !String.isEmpty(arrivalTo) && !String.isEmpty(departureDateStr)) {
            Date departureDate;
            try {
                departureDate = Date.valueOf(departureDateStr);
            } catch (Exception e) {
                return new List<Airlines__c>();
            }

            return [SELECT Id, Name, City_From__c, City_To__c, Departure_Date__c, Price__c, Available_Ticket__c
                    FROM Airlines__c
                    WHERE Available_Ticket__c > 0
                    AND City_From__c = :departureFrom
                    AND City_To__c = :arrivalTo
                    AND Departure_Date__c = :departureDate];
        }
        return new List<Airlines__c>();
    }

    @AuraEnabled
    public static Id createBookingRecord(Id flightId, String customerName, String customerEmail, String customerPhone, String cityFrom, String cityTo, Date departureDate, Decimal price, String Offers) {
        Booking__c newBooking = new Booking__c();

        if (!String.isEmpty(customerName) && !String.isEmpty(customerEmail)) {
            newBooking.Name = customerName;
            newBooking.Email__c = customerEmail;
            newBooking.Phone__c = customerPhone; 
            newBooking.Airline_Name__c = flightId;
            newBooking.City_From__c = cityFrom;
            newBooking.City_To__c = cityTo;
            newBooking.Departure_Date__c = departureDate;
            newBooking.Currency__c = price;

newBooking.Offers__c = Offers;

            try{
                insert newBooking;
                
            } 
            catch(Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
            return newBooking.Id;
        }
        else{
            throw new AuraHandledException('Please fill all fields');
        }
    }
}
    






