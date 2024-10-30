import React from 'react';
import Layout from '@src/layout';
import './successpage.scss';

const SuccessPage = () => {
  return (
    <Layout>
      <div className="container text-center">
        <h1>Booking Confirmed!</h1>
        <p>Your booking was successful. We look forward to hosting you!</p>
        <a href="/" className="btn btn-primary">Return to Home</a>
      </div>
    </Layout>
  );
};

export default SuccessPage;
