import React from 'react';
import { htmlEntitie } from '../../util/entities';

const Card = ({
  index,
  suit,
  weight,
}) => {

  return (
    <div className={`card ${suit}`}>
      <span className="rank">{ weight }</span>
      <span className="suit">{ htmlEntitie(suit) }</span>
    </div>
  );

};

export default Card;
