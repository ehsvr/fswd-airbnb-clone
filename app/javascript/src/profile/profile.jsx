import React from 'react';
import { handleErrors } from '@utils/fetchHelper'; 
import Layout from '@src/layout';

import './profile.scss';

class Profile extends React.Component {
  state = {
    user: null,
    bookings: [],
    loading: true,
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentCompleted = urlParams.get('payment') === 'success';
  
    fetch('/api/current_user')
      .then(handleErrors)
      .then(data => {
        if (data.user) {
          this.setState({ user: data.user });
          this.fetchUserBookings(data.user.id, paymentCompleted); // Passing an indicator if payment is complete
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        this.setState({ loading: false });
      });
  }
  
  fetchUserBookings = (userId, forceReload = false) => {
    if (forceReload) {
      this.setState({ loading: true });  // Show loading state while refetching
    }
  
    fetch(`/api/users/${userId}/bookings`)
      .then(handleErrors)
      .then(data => {
        this.setState({ bookings: data.bookings, loading: false });
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        this.setState({ loading: false });
      });
  }

  initiateStripeCheckout = (booking_id) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  
    fetch(`/api/charges?booking_id=${booking_id}&cancel_url=${window.location.pathname}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
    })
    .then(handleErrors)
    .then(response => {
      const stripe = window.Stripe('pk_test_51Q2HjKEHkn2ZS6oNGm8H0xNkSp5cULxZCGIQxkjM2cmJf4yMiXZz8dMrlQg9Pa166Cde3z6ad9xD19Eg7gMN3OWW00DVad7zLF');
      return stripe.redirectToCheckout({
        sessionId: response.charge.checkout_session_id,
      });
    })
    .then((result) => {
      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        this.fetchUserBookings(this.state.user.id);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
  
  

  render() {
    const { user, bookings, loading } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    return (
      <Layout>
        <div className="container">
          <h1>User Profile</h1>
          {user ? (
            <div>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ) : (
            <p>Please log in to view your profile.</p>
          )}

          <h2>Your Bookings</h2>
          <div className="bookings">
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <p><strong>Property:</strong> {booking.property?.title || 'N/A'}</p>
                  <p><strong>Location:</strong> {booking.property?.city || 'N/A'}</p>
                  <p><strong>Price per Night:</strong> ${booking.property?.price_per_night || 'N/A'}</p>
                  <p><strong>Dates:</strong> {booking.start_date} to {booking.end_date}</p>
                  <p><strong>Status:</strong> {booking.paid ? 'Paid' : 'Not Paid'}</p>
                  {!booking.paid && (
                    <button 
                      onClick={() => this.initiateStripeCheckout(booking.id)} 
                      className="btn btn-primary">
                      Proceed to Payment
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No bookings found.</p>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

export default Profile;
