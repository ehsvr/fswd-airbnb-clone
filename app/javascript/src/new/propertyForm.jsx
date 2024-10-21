import React, { useState } from 'react';
import Layout from '@src/layout';
import './new.scss'

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    country: '',
    property_type: '',
    price_per_night: '',
    max_guests: '',
    bedrooms: '',
    beds: '',
    baths: '',
    images: null,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images' && value) {
        Array.from(value).forEach((file) => {
          data.append('property[images][]', file);
        });
      } else {
        data.append(`property[${key}]`, value);
      }
    });

    fetch('/api/properties', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      body: data,
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          setErrorMessage(error.errors.join(', '));
          throw new Error(error.errors);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log('Property created:', data);
      window.location.href = `/property/${data.id}`;
    })
    .catch((error) => {
      console.error('Error creating property:', error);
    });
  };

  return (
    <Layout>
    <h4>List on Airbnb</h4>
    <div className="property-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div>
          <label>Country:</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} required />
        </div>
        <div>
          <label>Property Type:</label>
          <input type="text" name="property_type" value={formData.property_type} onChange={handleChange} required />
        </div>
        <div>
          <label>Price Per Night:</label>
          <input type="number" name="price_per_night" value={formData.price_per_night} onChange={handleChange} required />
        </div>
        <div>
          <label>Max Guests:</label>
          <input type="number" name="max_guests" value={formData.max_guests} onChange={handleChange} required />
        </div>
        <div>
          <label>Bedrooms:</label>
          <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
        </div>
        <div>
          <label>Beds:</label>
          <input type="number" name="beds" value={formData.beds} onChange={handleChange} required />
        </div>
        <div>
          <label>Baths:</label>
          <input type="number" name="baths" value={formData.baths} onChange={handleChange} required />
        </div>
        <div>
          <label>Images:</label>
          <input type="file" name="images" multiple onChange={handleChange} />
        </div>
        <button type="submit">Create Listing</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
    </div>
    </Layout>
  );
};

export default PropertyForm;
