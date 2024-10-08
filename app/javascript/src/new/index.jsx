// app/javascript/src/new/index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import New from './new';

document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('new-property-form'); // Ensure this ID matches your HTML
  if (element) {
    ReactDOM.render(<New />, element);
  }
});