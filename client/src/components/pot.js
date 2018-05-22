import React from 'react';

const Pot = ({ value }) => (
  <div className="pot">
    <span>Pot</span>
    <span className="pot-value">{value} $</span>
  </div>
);

export default Pot;
