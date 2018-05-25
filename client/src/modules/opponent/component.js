import React from 'react';
import _ from 'lodash';
import Card from '../../components/card';
import { PokerHand } from '../../util/poker';

class Opponent extends React.Component {
  render() {
    const hand = this.props.opponent.get('hand');
    const money = this.props.opponent.get('money');

    const handElement = (hand.size !== 0) ? (
      hand.map((card, index) =>
        <Card
          key={ index }
          index={ index }
          weight={ card.get('rank') }
          suit={ card.get('suit') }
        />)
    ) : (
      _.times(5, index => <div key={index} className="card back">*</div>)
    );

    const labelElement = (hand.size === 0) ? (
      <span className="result-opponent">{money} $</span>
    ) : (
      <span className="result-opponent">{PokerHand(hand).type}</span>
    );

    return (
      <div className="playingCards simpleCards opponent-box">
        {handElement} <br/>
        {labelElement}
      </div>
    );
  }
}

export default Opponent;
