import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createBookingRecord from '@salesforce/apex/FlightSearchController.createBookingRecord';
import getFlightsDetails from '@salesforce/apex/FlightSearchController.getFlightsDetails';

export default class flightBookingComponent extends LightningElement {

    @track isModalOpen = false;
    @track flightList = [];
    @api selectedFlight;
    @track Name;
    @track Email;
    @track Phone;
    departureFrom = '';
    arrivalTo = '';
    departureDate = '';
    showFlights = false;

    handleDepartureFromChange(event) {
        this.departureFrom = event.target.value;
    }
    handleArrivalToChange(event) {
        this.arrivalTo = event.target.value;
    }
    handleDateChange(event) {
        this.departureDate = event.target.value; // Keep as string
    }

    handleSearch() {
        this.showFlights = true;

        getFlightsDetails({
            departureFrom: this.departureFrom,
            arrivalTo: this.arrivalTo,
            departureDateStr: this.departureDate
        })
        .then(result => {
            this.flightList = result || [];
        })
        .catch(error => {
            this.flightList = [];
        });
    }

    handleBook(event) {
        const flightId = event.currentTarget.dataset.flightId;
        this.selectedFlight = this.flightList.find(flight => flight.Id === flightId);
    }

    handleName(event) {
        this.Name = event.target.value;
    }
    handleEmail(event) {
        this.Email = event.target.value;
    }
    handlePhone(event) {
        this.Phone = event.target.value;
    }

    handleConfirmBooking() {
        createBookingRecord({
            flightId: this.selectedFlight.Id,
            customerName: this.Name,
            customerEmail: this.Email,
            customerPhone: this.Phone,
            cityFrom: this.selectedFlight.City_From__c,
            cityTo: this.selectedFlight.City_To__c,
            departureDate: this.selectedFlight.Departure_Date__c,
            price: this.selectedFlight.Price__c
        })
        .then(result => {
            this.showToast('Success', 'Your Booking is Successful! You are redirected to the search page', 'success');
            //Refresh the whole page after 5 sec
            setTimeout(() => {
                window.location.reload();
            }, 5000); // 5000 milliseconds = 5 seconds
        })
        .catch(error => {
            this.showToast('Error', error.body ? error.body.message : error.message, 'error');
            console.error(error);
        });
    }

    handleCancelBooking() {
        this.selectedFlight = null;
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
    closeModal() {
        this.isModalOpen = false;
    }
}


    

