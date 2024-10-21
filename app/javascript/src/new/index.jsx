import React from 'react';
import ReactDOM from 'react-dom';
import PropertyForm from './propertyForm';

const NewPropertyPage = () => {
  return (
    <div>
      <PropertyForm />
    </div>
  );
};

// Render the component once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('new-property-form'); // Ensure this ID matches your HTML
  if (element) {
    ReactDOM.render(<NewPropertyPage />, element);
  }
});