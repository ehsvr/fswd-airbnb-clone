import React from 'react';
import Layout from '@src/layout';
import BookingWidget from './bookingWidget';
import { handleErrors } from '@utils/fetchHelper';
import './property.scss';

class Property extends React.Component {
  state = {
    property: {},
    loading: true,
    currentUserId: null,
  };

  componentDidMount() {
    fetch('/api/current_user')
      .then(handleErrors)
      .then(data => {
        if (data.user) {
          console.log("Fetched Current User ID:", data.user); // Update this log
          this.setState({ currentUserId: data.user });
        } else {
          console.error("No user data returned from /api/current_user");
        }
      })
      .catch(error => console.error('Error fetching current user:', error));
  
    fetch(`/api/properties/${this.props.property_id}`)
      .then(handleErrors)
      .then(data => {
        console.log("Fetched Property Owner ID:", data.property.user.id);
        this.setState({
          property: data.property,
          loading: false,
        });
      });
  }
  

  handleEdit = () => {
    const { property } = this.state;
    window.location.href = `/properties/edit/${property.id}`;
  };

  handleDelete = () => {
    const { property } = this.state;

    fetch(`/api/properties/${property.id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
    })
      .then(response => {
        if (response.ok) {
          window.location.href = '/properties';
        } else {
          console.error('Error deleting property');
        }
      });
  };

  render() {
    const { property, loading, currentUserId } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    const {
      id,
      title,
      description,
      city,
      country,
      property_type,
      price_per_night,
      max_guests,
      bedrooms,
      beds,
      baths,
      image_urls,
      user,
    } = property;

    const image_url = image_urls && image_urls.length > 0 ? image_urls[0] : '/images/default-image.jpg';

    return (
      <Layout>
        <div className="property-image mb-3" style={{ backgroundImage: `url(${image_url})` }} />
        <div className="container">
          <div className="row">
            <div className="info col-12 col-lg-7">
              <div className="mb-3">
                <h3 className="mb-0">{title}</h3>
                <p className="text-uppercase mb-0 text-secondary"><small>{city}</small></p>
                <p className="mb-0"><small>Hosted by <b>{user.username}</b></small></p>
              </div>
              <div>
                <p className="mb-0 text-capitalize"><b>{property_type}</b></p>
                <p>
                  <span className="me-3">{max_guests} guests</span>
                  <span className="me-3">{bedrooms} bedroom</span>
                  <span className="me-3">{beds} bed</span>
                  <span className="me-3">{baths} bath</span>
                </p>
              </div>
              <hr />
              <p>{description}</p>
              {currentUserId === user.id && (
                <div className="property-actions">
                  <button onClick={this.handleEdit} className="btn btn-primary me-2">Edit</button>
                  <button onClick={this.handleDelete} className="btn btn-danger">Delete</button>
                </div>
              )}
            </div>
            <div className="col-12 col-lg-5">
              <BookingWidget property_id={id} price_per_night={price_per_night} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Property;
