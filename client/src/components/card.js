import React from 'react';
import htmlEntitie from '../util/entities';

const Card = ({
  suit,
  weight,
  selected,
  index,
  manageCard,
}) => (
    <div
      className={`card ${suit} ${selected ? 'selected' : ''}`}
      onClick={() => { if (typeof manageCard !== 'undefined') manageCard(index, selected); }}
    >
      <span className="rank">{ weight }</span>
      <span className="suit">{ htmlEntitie(suit) }</span>
    </div>
);

export default Card;
