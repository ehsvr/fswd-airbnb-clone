import React from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import 'react-dates/lib/css/_datepicker.css';

class BookingWidget extends React.Component {
  state = {
    authenticated: false,
    existingBookings: [],
    startDate: null,
    endDate: null,
    focusedInput: null,
    loading: false,
    error: false,
    success: false, 
  }

  componentDidMount() {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        this.setState({ authenticated: data.authenticated });
      });
    this.getPropertyBookings();
  }

  getPropertyBookings = () => {
    fetch(`/api/properties/${this.props.property_id}/bookings`)
      .then(handleErrors)
      .then(data => {
        this.setState({ existingBookings: data.bookings });
      });
  }

  submitBooking = (e) => {
    if (e) { e.preventDefault(); }
    
    const { startDate, endDate } = this.state;
    if (!startDate || !endDate) {
      alert("Please select a start and end date before submitting.");
      return;
    }

    fetch(`/api/bookings`, safeCredentials({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        booking: {
          property_id: this.props.property_id,
          start_date: startDate.format('YYYY-MM-DD'),
          end_date: endDate.format('YYYY-MM-DD'),
        }
      })
    }))
    .then(handleErrors)
    .then(response => {
      return this.initiateStripeCheckout(response.booking.id);
    })
    .catch(error => {
      console.error('Error during booking creation:', error);
    });
  }

  initiateStripeCheckout = (booking_id) => {
    return fetch(`/api/charges?booking_id=${booking_id}&cancel_url=${window.location.pathname}`, safeCredentials({
      method: 'POST',
    }))
    .then(handleErrors)
    .then(response => {
      const stripe = Stripe('pk_test_51Q2HjKEHkn2ZS6oNGm8H0xNkSp5cULxZCGIQxkjM2cmJf4yMiXZz8dMrlQg9Pa166Cde3z6ad9xD19Eg7gMN3OWW00DVad7zLF');
      stripe.redirectToCheckout({
        sessionId: response.charge.checkout_session_id,
      }).then((result) => {
        if (result.error) {
          console.error('Stripe Checkout Error:', result.error.message);
          this.setState({
            error: true,
            errorMessage: result.error.message,
          });
          alert(`Error: ${result.error.message}`);
        } else {
          this.setState({ success: true }); 
          window.location.href = '/booking/success'; 
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  onDatesChange = ({ startDate, endDate }) => this.setState({ startDate, endDate });
  onFocusChange = (focusedInput) => this.setState({ focusedInput });
  isDayBlocked = day => this.state.existingBookings.filter(b => day.isBetween(b.start_date, b.end_date, null, '[)')).length > 0;

  render() {
    const { authenticated, startDate, endDate, focusedInput, success } = this.state;
    if (success) return <p>Redirecting to success page...</p>;

    if (!authenticated) {
      return (
        <div className="border p-4 mb-4">
          Please <a href={`/login?redirect_url=${window.location.pathname}`}>log in</a> to make a booking.
        </div>
      );
    };

    const { price_per_night } = this.props;
    let days;
    if (startDate && endDate) {
      days = endDate.diff(startDate, 'days');
    }

    return (
      <div className="border p-4 mb-4">
        <form onSubmit={this.submitBooking}>
          <h5>${price_per_night} <small>per night</small></h5>
          <hr/>
          <div style={{ marginBottom: focusedInput ? '400px': '2rem' }}>
            <DateRangePicker
              startDate={startDate}
              startDateId="start_date"
              endDate={endDate}
              endDateId="end_date"
              onDatesChange={this.onDatesChange}
              focusedInput={focusedInput}
              onFocusChange={this.onFocusChange}
              isDayBlocked={this.isDayBlocked}
              numberOfMonths={1}
            />
          </div>
          {days && (
            <div className="d-flex justify-content-between">
              <p>Total</p>
              <p>${(price_per_night * days).toLocaleString()}</p>
            </div>
          )}
          <button type="submit" className="btn btn-large btn-danger btn-block">
            Book
          </button>
        </form>
      </div>
    );
  }
}

export default BookingWidget;
